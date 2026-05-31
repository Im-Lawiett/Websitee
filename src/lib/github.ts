import { Prompt } from './data'
import { encodeBase64, decodeBase64 } from './utils'

export interface GithubConfig {
  token: string
  username: string
  repo: string
  branch: string
  path: string
  sha: string
}

const DEFAULT_CONFIG: GithubConfig = {
  token: '',
  username: '',
  repo: '',
  branch: 'main',
  path: 'database.json',
  sha: '',
}

const CONFIG_KEY = 'ai_collection_github_config'

export function loadConfig(): GithubConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG
  try {
    const saved = localStorage.getItem(CONFIG_KEY)
    if (saved) return { ...DEFAULT_CONFIG, ...JSON.parse(saved) }
  } catch {}
  return DEFAULT_CONFIG
}

export function saveConfig(config: GithubConfig): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
  } catch {}
}

export function clearConfig(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(CONFIG_KEY)
}

export function isConnected(config: GithubConfig): boolean {
  return !!(config.token && config.username && config.repo)
}

async function apiFetch(config: GithubConfig, method: string, body?: object) {
  const url = `https://api.github.com/repos/${config.username}/${config.repo}/contents/${config.path}?ref=${config.branch}`
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `token ${config.token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  return res
}

export async function loadPrompts(config: GithubConfig): Promise<{ prompts: Prompt[]; sha: string } | null> {
  try {
    const res = await apiFetch(config, 'GET')
    if (res.status === 404) return { prompts: [], sha: '' }
    if (!res.ok) return null
    const data = await res.json()
    const content = decodeBase64(data.content.replace(/\n/g, ''))
    const parsed = JSON.parse(content)
    return { prompts: parsed.prompts || [], sha: data.sha }
  } catch {
    return null
  }
}

export async function savePrompts(
  config: GithubConfig,
  prompts: Prompt[]
): Promise<string | null> {
  try {
    const content = encodeBase64(JSON.stringify({ prompts }, null, 2))
    const body: Record<string, string> = {
      message: `Update prompts - ${new Date().toISOString()}`,
      content,
      branch: config.branch,
    }
    if (config.sha) body.sha = config.sha

    const res = await apiFetch(config, 'PUT', body)

    if (res.status === 409) {
      const getRes = await apiFetch(config, 'GET')
      if (getRes.ok) {
        const getData = await getRes.json()
        body.sha = getData.sha
        const retry = await apiFetch(config, 'PUT', body)
        if (!retry.ok) return null
        const retryData = await retry.json()
        return retryData.content.sha
      }
      return null
    }

    if (!res.ok) return null
    const data = await res.json()
    return data.content.sha
  } catch {
    return null
  }
}

export async function testConnection(
  token: string,
  username: string,
  repo: string
): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`https://api.github.com/repos/${username}/${repo}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    })
    if (!res.ok) {
      if (res.status === 401) return { success: false, message: 'Token tidak valid atau expired' }
      if (res.status === 404) return { success: false, message: 'Repository tidak ditemukan' }
      return { success: false, message: 'Gagal terhubung ke GitHub' }
    }
    const data = await res.json()
    if (!data.permissions?.push) {
      return { success: false, message: 'Token tidak memiliki izin write ke repo ini' }
    }
    return { success: true, message: `Terhubung ke ${data.full_name}` }
  } catch (e) {
    return { success: false, message: 'Gagal terhubung: ' + (e as Error).message }
  }
}
