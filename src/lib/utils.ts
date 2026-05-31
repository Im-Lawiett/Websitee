import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getPlatformBadgeClass(platform: string): string {
  const p = platform.toLowerCase().replace(/\s+/g, '')
  const map: Record<string, string> = {
    chatgpt: 'badge-chatgpt',
    claude: 'badge-claude',
    gemini: 'badge-gemini',
    grok: 'badge-grok',
    deepseek: 'badge-deepseek',
    perplexity: 'badge-perplexity',
    dola: 'badge-dola',
    microsoftcopilot: 'badge-copilot',
    copilot: 'badge-copilot',
    midjourney: 'badge-midjourney',
    metalllama: 'badge-llama',
    llama: 'badge-llama',
    qwenai: 'badge-qwen',
    qwen: 'badge-qwen',
    stablediffusion: 'badge-stable',
  }
  return map[p] || 'badge-chatgpt'
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function truncate(str: string, len: number): string {
  if (str.length <= len) return str
  return str.slice(0, len) + '...'
}

export function encodeBase64(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
}

export function decodeBase64(str: string): string {
  return decodeURIComponent(escape(atob(str)))
}
