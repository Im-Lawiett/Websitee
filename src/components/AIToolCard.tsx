'use client'

import { ExternalLink, Star } from 'lucide-react'
import { AITool } from '@/lib/data'
import { cn } from '@/lib/utils'

interface Props {
  tool: AITool
  index: number
}

export default function AIToolCard({ tool, index }: Props) {
  return (
    <a
      href={tool.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'group relative flex flex-col rounded-2xl overflow-hidden',
        'border border-white/[0.06] hover:border-white/[0.14]',
        'bg-[#0f0f0f] card-hover',
        'animate-fade-up'
      )}
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      {/* Cover Image */}
      <div className="relative h-44 overflow-hidden">
        <div
          className="absolute inset-0 cover-image bg-center bg-cover"
          style={{ backgroundImage: `url(${tool.cover})` }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-[#0f0f0f]" />
        {/* Color accent overlay */}
        <div
          className="absolute inset-0 opacity-20 mix-blend-overlay"
          style={{ background: `radial-gradient(ellipse at center, ${tool.color} 0%, transparent 70%)` }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {tool.badge && (
            <span
              className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-lg"
              style={{ backgroundColor: tool.color + 'cc' }}
            >
              {tool.badge}
            </span>
          )}
          {!tool.free && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white bg-zinc-800/90">
              Pro
            </span>
          )}
        </div>

        {/* External link icon */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-black/50 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0">
          <ExternalLink className="w-3.5 h-3.5 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-white/10"
            style={{ backgroundColor: tool.color + '20' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={tool.logo}
              alt={`${tool.name} logo`}
              className="w-7 h-7 object-contain"
              loading="lazy"
              onError={(e) => {
                const el = e.currentTarget
                el.style.display = 'none'
                if (el.parentElement) {
                  el.parentElement.innerHTML = `<span style="color:${tool.color};font-size:16px;font-weight:900">${tool.name[0]}</span>`
                }
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-white text-[15px] leading-tight truncate">{tool.name}</h3>
              {tool.popular && (
                <Star className="w-3 h-3 flex-shrink-0" style={{ color: tool.color, fill: tool.color }} />
              )}
            </div>
            <p className="text-zinc-500 text-[11px] mt-0.5 truncate">{tool.company}</p>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-zinc-400 text-[12px] leading-relaxed line-clamp-2">{tool.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {tool.features.slice(0, 4).map((feat) => (
            <span
              key={feat}
              className="px-2 py-0.5 rounded-md text-[10px] font-medium border"
              style={{
                color: tool.color,
                borderColor: tool.color + '30',
                backgroundColor: tool.color + '10',
              }}
            >
              {feat}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div
          className="mt-2 py-2.5 rounded-xl text-center text-[12px] font-semibold transition-all duration-200 group-hover:opacity-100 opacity-80"
          style={{
            background: `linear-gradient(135deg, ${tool.color}25, ${tool.color}10)`,
            color: tool.color,
            border: `1px solid ${tool.color}30`,
          }}
        >
          Buka {tool.name} →
        </div>
      </div>
    </a>
  )
}
