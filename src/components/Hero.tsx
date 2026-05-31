'use client'

import { useEffect, useRef } from 'react'
import { AI_TOOLS } from '@/lib/data'

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    const particles: Array<{
      x: number; y: number; vx: number; vy: number
      size: number; opacity: number; color: string
    }> = []

    const colors = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b']

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()
      })
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Gradient orbs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-blue-600/8 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[120px] animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-cyan-600/5 blur-[150px]" />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto pt-24">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-zinc-400 mb-8 backdrop-blur-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          by RianModss — Updated {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-6">
          <span className="text-white">Koleksi </span>
          <span className="text-gradient-blue">AI Terbaik</span>
          <br />
          <span className="text-white text-4xl md:text-6xl lg:text-7xl font-bold">di Satu Tempat</span>
        </h1>

        <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
          Temukan, eksplorasi, dan simpan prompt terbaik untuk ChatGPT, Claude, Gemini, Grok, DeepSeek, dan {AI_TOOLS.length - 6}+ AI lainnya.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16">
          <a
            href="#ai-tools"
            className="px-8 py-3.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-zinc-100 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Lihat Koleksi AI
          </a>
          <a
            href="#prompts"
            className="px-8 py-3.5 bg-white/[0.05] text-white font-semibold text-sm rounded-xl border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-200"
          >
            Prompt Library
          </a>
        </div>

        {/* Stats */}
        <div className="inline-flex items-center gap-8 px-8 py-4 rounded-2xl glass">
          <div className="text-center">
            <div className="text-2xl font-black text-white">{AI_TOOLS.length}+</div>
            <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium mt-0.5">AI Tools</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-black text-white">Free</div>
            <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium mt-0.5">Akses</div>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-black text-white">∞</div>
            <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-medium mt-0.5">Prompts</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-12 bg-gradient-to-b from-white/0 to-white/60" />
        <div className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">Scroll</div>
      </div>
    </section>
  )
}
