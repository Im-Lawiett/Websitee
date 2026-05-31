'use client'

import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { AI_TOOLS, CATEGORIES } from '@/lib/data'
import AIToolCard from './AIToolCard'
import { cn } from '@/lib/utils'

export default function AIToolsSection() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')

  const filtered = useMemo(() => {
    return AI_TOOLS.filter((t) => {
      const matchSearch =
        !search ||
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.company.toLowerCase().includes(search.toLowerCase())
      const matchCat = category === 'all' || t.category === category
      return matchSearch && matchCat
    })
  }, [search, category])

  return (
    <section id="ai-tools" className="py-24 px-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <SlidersHorizontal className="w-3 h-3" />
            AI Collection
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            {AI_TOOLS.length}+ Platform AI Terbaik
          </h2>
          <p className="text-zinc-500 text-base max-w-lg mx-auto">
            Kumpulan AI tools terpopuler dunia — dari chatbot, image generator, hingga AI search engine.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari AI tool..."
              className="w-full pl-11 pr-4 py-3 bg-[#111] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-white/20 transition-colors"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={cn(
                'px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200',
                category === cat.id
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-zinc-400 border-white/10 hover:border-white/20 hover:text-white'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-zinc-600">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-medium">Tidak ada AI tool yang ditemukan</p>
            <p className="text-sm mt-1">Coba kata kunci lain</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((tool, i) => (
              <AIToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
