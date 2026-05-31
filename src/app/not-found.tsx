import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#080808] flex items-center justify-center text-center px-6">
      <div>
        <div className="text-8xl font-black text-white/10 mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-2">Halaman tidak ditemukan</h1>
        <p className="text-zinc-500 mb-8">Maaf, halaman yang kamu cari tidak ada.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-100 transition-all"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  )
}
