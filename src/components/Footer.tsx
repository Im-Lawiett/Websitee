import { Zap, Send, Github } from 'lucide-react'
import { AI_TOOLS } from '@/lib/data'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.05] bg-[#080808]">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <div>
                <div className="font-bold text-white">RianModss</div>
                <div className="text-[10px] text-zinc-600 uppercase tracking-[0.2em]">AI Collection</div>
              </div>
            </div>
            <p className="text-zinc-600 text-sm leading-relaxed max-w-xs">
              Koleksi website AI terbaik di satu tempat. Temukan, eksplorasi, dan kelola prompt AI kamu.
            </p>
          </div>

          {/* AI Links */}
          <div>
            <h3 className="font-semibold text-zinc-400 text-xs uppercase tracking-wider mb-4">AI Tools</h3>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4">
              {AI_TOOLS.slice(0, 8).map(tool => (
                <a
                  key={tool.id}
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 hover:text-white text-sm transition-colors truncate"
                >
                  {tool.name}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-zinc-400 text-xs uppercase tracking-wider mb-4">Kontak</h3>
            <div className="flex flex-col gap-2">
              <a
                href="https://t.me/RianModss"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-zinc-600 hover:text-white text-sm transition-colors group"
              >
                <Send className="w-3.5 h-3.5 group-hover:text-blue-400" />
                Telegram
              </a>
              <a
                href="#ai-tools"
                className="text-zinc-600 hover:text-white text-sm transition-colors"
              >
                AI Collection
              </a>
              <a
                href="#prompts"
                className="text-zinc-600 hover:text-white text-sm transition-colors"
              >
                Prompt Library
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/[0.04] px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-zinc-700 text-xs">
            © {new Date().getFullYear()} RianModss — AI Collection. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-zinc-700 text-xs">{AI_TOOLS.length}+ AI Tools</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span className="text-zinc-700 text-xs">Made with ❤️ by RianModss</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
