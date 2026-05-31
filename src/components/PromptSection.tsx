'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Plus, LayoutGrid, List, Search, RefreshCw, Wifi, WifiOff, Settings,
  Loader2, X, Lock, Check, Eye, EyeOff, Loader
} from 'lucide-react'
import { Prompt, DEFAULT_PROMPTS, AI_TOOLS } from '@/lib/data'
import {
  GithubConfig, loadConfig, saveConfig, clearConfig,
  isConnected, loadPrompts, savePrompts, testConnection
} from '@/lib/github'
import { getPlatformBadgeClass, formatDate } from '@/lib/utils'
import PromptCard from './PromptCard'
import PromptModal from './PromptModal'
import { cn } from '@/lib/utils'

const CRUD_PASSWORD = 'admin#$***&'
const PLATFORMS_FILTER = [
  'Semua', 'ChatGPT', 'Claude', 'Gemini', 'Grok', 'DeepSeek',
  'Perplexity', 'Dola', 'Microsoft Copilot', 'Midjourney',
  'Meta Llama', 'Qwen AI', 'Stable Diffusion',
]

export default function PromptSection() {
  const [prompts, setPrompts] = useState<Prompt[]>(DEFAULT_PROMPTS)
  const [config, setConfig] = useState<GithubConfig | null>(null)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('Semua')
  const [listView, setListView] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [adminPromptOpen, setAdminPromptOpen] = useState(false)
  const [adminPass, setAdminPass] = useState('')
  const [adminError, setAdminError] = useState('')

  // Server config form
  const [cfgToken, setCfgToken] = useState('')
  const [cfgUser, setCfgUser] = useState('')
  const [cfgRepo, setCfgRepo] = useState('')
  const [cfgBranch, setCfgBranch] = useState('main')
  const [cfgPath, setCfgPath] = useState('database.json')
  const [cfgTesting, setCfgTesting] = useState(false)
  const [cfgMsg, setCfgMsg] = useState('')
  const [showToken, setShowToken] = useState(false)

  useEffect(() => {
    const cfg = loadConfig()
    setConfig(cfg)
    if (isConnected(cfg)) {
      setConnected(true)
      setCfgToken(cfg.token)
      setCfgUser(cfg.username)
      setCfgRepo(cfg.repo)
      setCfgBranch(cfg.branch)
      setCfgPath(cfg.path)
      fetchPrompts(cfg)
    }
  }, [])

  const fetchPrompts = useCallback(async (cfg: GithubConfig) => {
    if (!isConnected(cfg)) return
    setLoading(true)
    const result = await loadPrompts(cfg)
    setLoading(false)
    if (result) {
      setPrompts(result.prompts.length > 0 ? result.prompts : DEFAULT_PROMPTS)
      const updated = { ...cfg, sha: result.sha }
      setConfig(updated)
      saveConfig(updated)
    }
  }, [])

  const persist = useCallback(async (newPrompts: Prompt[]) => {
    if (!config || !isConnected(config)) {
      setPrompts(newPrompts)
      return
    }
    setLoading(true)
    const sha = await savePrompts(config, newPrompts)
    setLoading(false)
    if (sha !== null) {
      const updated = { ...config, sha }
      setConfig(updated)
      saveConfig(updated)
      setPrompts(newPrompts)
    }
  }, [config])

  const handleSave = async (data: Omit<Prompt, 'id'>) => {
    if (editingPrompt) {
      const updated = prompts.map(p =>
        p.id === editingPrompt.id ? { ...editingPrompt, ...data } : p
      )
      await persist(updated)
    } else {
      const newId = Math.max(0, ...prompts.map(p => p.id)) + 1
      await persist([...prompts, { id: newId, ...data }])
    }
    setEditingPrompt(null)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin hapus prompt ini?')) return
    await persist(prompts.filter(p => p.id !== id))
  }

  const handleEdit = (p: Prompt) => {
    setEditingPrompt(p)
    setModalOpen(true)
  }

  const handleAdd = () => {
    if (!isAdmin) {
      setAdminPromptOpen(true)
      return
    }
    setEditingPrompt(null)
    setModalOpen(true)
  }

  const checkAdmin = () => {
    if (adminPass === CRUD_PASSWORD) {
      setIsAdmin(true)
      setAdminPromptOpen(false)
      setAdminPass('')
      setAdminError('')
      setEditingPrompt(null)
      setModalOpen(true)
    } else {
      setAdminError('Password salah!')
      setAdminPass('')
    }
  }

  const connectServer = async () => {
    setCfgTesting(true)
    setCfgMsg('')
    const result = await testConnection(cfgToken, cfgUser, cfgRepo)
    if (result.success) {
      const newCfg: GithubConfig = {
        token: cfgToken, username: cfgUser, repo: cfgRepo,
        branch: cfgBranch, path: cfgPath, sha: ''
      }
      saveConfig(newCfg)
      setConfig(newCfg)
      setConnected(true)
      setCfgMsg('✓ ' + result.message)
      setSettingsOpen(false)
      fetchPrompts(newCfg)
    } else {
      setCfgMsg('✗ ' + result.message)
    }
    setCfgTesting(false)
  }

  const disconnect = () => {
    clearConfig()
    setConfig(loadConfig())
    setConnected(false)
    setPrompts(DEFAULT_PROMPTS)
    setCfgToken(''); setCfgUser(''); setCfgRepo('')
    setCfgMsg('')
  }

  const filtered = useMemo(() =>
    prompts.filter(p => {
      const matchSearch = !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.platform.toLowerCase().includes(search.toLowerCase()) ||
        p.content.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filter === 'Semua' || p.platform === filter
      return matchSearch && matchFilter
    }),
    [prompts, search, filter]
  )

  const counts = useMemo(() => {
    const map: Record<string, number> = { Semua: prompts.length }
    prompts.forEach(p => { map[p.platform] = (map[p.platform] || 0) + 1 })
    return map
  }, [prompts])

  return (
    <section id="prompts" className="py-24 px-6 relative z-10 border-t border-white/[0.04]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-semibold uppercase tracking-wider mb-4">
              <Lock className="w-3 h-3" />
              Prompt Library
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
              Koleksi Prompt AI
            </h2>
            <p className="text-zinc-500 text-sm">
              {prompts.length} prompt tersimpan — tersinkronisasi via GitHub
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Connection status */}
            <div
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium cursor-pointer transition-all',
                connected
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/15'
                  : 'bg-zinc-800/50 border-white/[0.08] text-zinc-500 hover:bg-zinc-800'
              )}
              onClick={() => setSettingsOpen(true)}
            >
              {connected ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {connected ? `${config?.username}/${config?.repo}` : 'Tidak Terhubung'}
            </div>

            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 border border-white/[0.06] transition-all"
              title="Pengaturan Server"
            >
              <Settings className="w-4 h-4" />
            </button>

            {connected && (
              <button
                onClick={() => config && fetchPrompts(config)}
                disabled={loading}
                className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/5 border border-white/[0.06] transition-all disabled:opacity-40"
                title="Refresh"
              >
                <RefreshCw className={cn('w-4 h-4', loading && 'animate-spin')} />
              </button>
            )}

            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl text-sm font-semibold hover:bg-zinc-100 transition-all"
            >
              <Plus className="w-4 h-4" />
              Tambah
            </button>
          </div>
        </div>

        {/* Search + View Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari prompt..."
              className="w-full pl-11 pr-4 py-2.5 bg-[#111] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
          <div className="flex gap-1 bg-[#111] border border-white/[0.08] rounded-xl p-1">
            <button
              onClick={() => setListView(false)}
              className={cn('p-2 rounded-lg transition-all', !listView ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white')}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setListView(true)}
              className={cn('p-2 rounded-lg transition-all', listView ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-white')}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-8 overflow-x-auto pb-1">
          {PLATFORMS_FILTER.filter(p => p === 'Semua' || counts[p]).map(p => (
            <button
              key={p}
              onClick={() => setFilter(p)}
              className={cn(
                'px-3.5 py-1.5 rounded-full text-xs font-semibold border whitespace-nowrap transition-all',
                filter === p
                  ? 'bg-white text-black border-white'
                  : 'text-zinc-400 border-white/10 hover:border-white/20 hover:text-white'
              )}
            >
              {p} {counts[p] !== undefined && <span className="opacity-60">({counts[p]})</span>}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-8 gap-3 text-zinc-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Memuat dari server...
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length === 0 ? (
          <div className="text-center py-16 text-zinc-600">
            <div className="text-4xl mb-3">📝</div>
            <p className="font-medium">Tidak ada prompt ditemukan</p>
          </div>
        ) : !loading && (
          <div className={cn(
            listView
              ? 'flex flex-col gap-2'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
          )}>
            {filtered.map(p => (
              <PromptCard
                key={p.id}
                prompt={p}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isAdmin={isAdmin}
                listView={listView}
              />
            ))}
          </div>
        )}
      </div>

      {/* Prompt Modal */}
      <PromptModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingPrompt(null) }}
        onSave={handleSave}
        editing={editingPrompt}
      />

      {/* Admin auth modal */}
      {adminPromptOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setAdminPromptOpen(false) }}
        >
          <div className="modal-enter w-full max-w-sm bg-[#111] border border-white/10 rounded-2xl p-6">
            <div className="text-center mb-5">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center mx-auto mb-3">
                <Lock className="w-5 h-5 text-violet-400" />
              </div>
              <h3 className="font-bold text-white text-base">Akses Admin</h3>
              <p className="text-zinc-500 text-xs mt-1">Masukkan password untuk tambah/edit prompt</p>
            </div>
            <input
              type="password"
              value={adminPass}
              onChange={e => { setAdminPass(e.target.value); setAdminError('') }}
              onKeyDown={e => e.key === 'Enter' && checkAdmin()}
              placeholder="Password admin..."
              className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm text-center placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors mb-3"
              autoFocus
            />
            {adminError && <p className="text-red-400 text-xs text-center mb-3">{adminError}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => { setAdminPromptOpen(false); setAdminPass(''); setAdminError('') }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 bg-white/5 border border-white/[0.08] hover:bg-white/8 transition-all"
              >
                Batal
              </button>
              <button
                onClick={checkAdmin}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white text-black hover:bg-zinc-100 transition-all"
              >
                Masuk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setSettingsOpen(false) }}
        >
          <div className="modal-enter w-full max-w-md bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <h2 className="font-bold text-white text-base flex items-center gap-2">
                <Settings className="w-4 h-4 text-zinc-400" />
                Pengaturan Server
              </h2>
              <button
                onClick={() => setSettingsOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              <p className="text-zinc-500 text-xs leading-relaxed">
                Hubungkan ke GitHub repository untuk menyimpan prompt secara permanen dan sinkron di semua perangkat.
              </p>

              {/* Token */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">GitHub Token</label>
                <div className="relative">
                  <input
                    type={showToken ? 'text' : 'password'}
                    value={cfgToken}
                    onChange={e => setCfgToken(e.target.value)}
                    placeholder="ghp_..."
                    className="w-full pl-4 pr-10 py-2.5 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowToken(!showToken)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Username</label>
                  <input type="text" value={cfgUser} onChange={e => setCfgUser(e.target.value)} placeholder="github_username" className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Repository</label>
                  <input type="text" value={cfgRepo} onChange={e => setCfgRepo(e.target.value)} placeholder="repo-name" className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Branch</label>
                  <input type="text" value={cfgBranch} onChange={e => setCfgBranch(e.target.value)} placeholder="main" className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">Path File</label>
                  <input type="text" value={cfgPath} onChange={e => setCfgPath(e.target.value)} placeholder="database.json" className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors" />
                </div>
              </div>

              {cfgMsg && (
                <p className={cn('text-xs px-3 py-2 rounded-lg border', cfgMsg.startsWith('✓')
                  ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                  : 'text-red-400 bg-red-400/10 border-red-400/20'
                )}>
                  {cfgMsg}
                </p>
              )}

              <div className="flex gap-2 pt-1">
                {connected && (
                  <button onClick={disconnect} className="px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400 bg-red-400/10 border border-red-400/20 hover:bg-red-400/15 transition-all">
                    Putuskan
                  </button>
                )}
                <button
                  onClick={connectServer}
                  disabled={cfgTesting || !cfgToken || !cfgUser || !cfgRepo}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-white text-black hover:bg-zinc-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {cfgTesting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {connected ? 'Perbarui Koneksi' : 'Hubungkan'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
