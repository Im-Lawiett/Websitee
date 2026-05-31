'use client'

import { useState, useEffect } from 'react'
import { X, Lock, Loader2 } from 'lucide-react'
import { Prompt, AI_TOOLS } from '@/lib/data'
import { cn } from '@/lib/utils'

const PLATFORMS = [
  'ChatGPT', 'Claude', 'Gemini', 'Grok', 'DeepSeek', 'Perplexity',
  'Dola', 'Microsoft Copilot', 'Midjourney', 'Meta Llama', 'Qwen AI',
  'Stable Diffusion',
]

interface Props {
  open: boolean
  onClose: () => void
  onSave: (p: Omit<Prompt, 'id'>) => Promise<void>
  editing?: Prompt | null
}

export default function PromptModal({ open, onClose, onSave, editing }: Props) {
  const [title, setTitle] = useState('')
  const [platform, setPlatform] = useState(PLATFORMS[0])
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (editing) {
      setTitle(editing.title)
      setPlatform(editing.platform)
      setContent(editing.content)
    } else {
      setTitle('')
      setPlatform(PLATFORMS[0])
      setContent('')
    }
    setError('')
  }, [editing, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      setError('Judul dan konten prompt wajib diisi.')
      return
    }
    setSaving(true)
    try {
      await onSave({
        title: title.trim(),
        platform,
        content: content.trim(),
        date: new Date().toISOString().split('T')[0],
      })
      onClose()
    } catch {
      setError('Gagal menyimpan prompt. Coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-enter w-full max-w-lg bg-[#111] border border-white/[0.1] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="font-bold text-white text-base">
            {editing ? 'Edit Prompt' : 'Tambah Prompt Baru'}
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
              Judul Prompt
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masukkan judul prompt..."
              className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
              Platform AI
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-white/20 transition-colors appearance-none"
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p} style={{ background: '#0f0f0f' }}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
              Konten Prompt
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Masukkan prompt kamu di sini..."
              rows={6}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors resize-none"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 bg-white/5 border border-white/[0.08] hover:bg-white/8 transition-all"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-black bg-white hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {editing ? 'Simpan Perubahan' : 'Tambah Prompt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
