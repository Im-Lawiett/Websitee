'use client'

import { useState } from 'react'
import { Copy, Check, Calendar, Pencil, Trash2 } from 'lucide-react'
import { Prompt } from '@/lib/data'
import { getPlatformBadgeClass, formatDate, truncate } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface Props {
  prompt: Prompt
  onEdit: (p: Prompt) => void
  onDelete: (id: number) => void
  isAdmin: boolean
  listView: boolean
}

export default function PromptCard({ prompt, onEdit, onDelete, isAdmin, listView }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(prompt.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (listView) {
    return (
      <div className="flex items-start gap-4 p-4 rounded-xl bg-[#0f0f0f] border border-white/[0.06] hover:border-white/[0.1] transition-all group">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold border', getPlatformBadgeClass(prompt.platform))}>
              {prompt.platform}
            </span>
            <span className="flex items-center gap-1 text-zinc-600 text-[10px]">
              <Calendar className="w-2.5 h-2.5" />
              {formatDate(prompt.date)}
            </span>
          </div>
          <h3 className="font-semibold text-white text-sm mb-1 truncate">{prompt.title}</h3>
          <p className="text-zinc-500 text-xs leading-relaxed line-clamp-1">{prompt.content}</p>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(prompt)}
                className="p-1.5 rounded-lg text-zinc-600 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(prompt.id)}
                className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          <button
            onClick={copy}
            className="p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-white/10 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col p-5 rounded-2xl bg-[#0f0f0f] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-200 group relative overflow-hidden">
      {/* Top shimmer line */}
      <div className="absolute top-0 inset-x-0 h-px shimmer opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <span className={cn('inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold border mb-2', getPlatformBadgeClass(prompt.platform))}>
            {prompt.platform}
          </span>
          <h3 className="font-bold text-white text-[14px] leading-snug line-clamp-2">{prompt.title}</h3>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {isAdmin && (
            <>
              <button
                onClick={() => onEdit(prompt)}
                className="p-1.5 rounded-lg text-zinc-600 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                title="Edit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onDelete(prompt.id)}
                className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all"
                title="Hapus"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content preview */}
      <p className="text-zinc-500 text-[12px] leading-relaxed line-clamp-3 flex-1 mb-4">
        {prompt.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/[0.05]">
        <div className="flex items-center gap-1.5 text-zinc-600 text-[10px]">
          <Calendar className="w-3 h-3" />
          <span>{formatDate(prompt.date)}</span>
        </div>
        <button
          onClick={copy}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all duration-200',
            copied
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
              : 'bg-white/[0.05] text-zinc-400 border border-white/[0.08] hover:bg-white/[0.08] hover:text-white'
          )}
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Disalin!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Salin
            </>
          )}
        </button>
      </div>
    </div>
  )
}
