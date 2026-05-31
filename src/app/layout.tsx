import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Collection — RianModss',
  description: 'Koleksi website AI terbaik: ChatGPT, Claude, Gemini, Grok, DeepSeek, Perplexity, Dola, dan lebih banyak lagi. Temukan dan simpan prompt terbaik kamu.',
  keywords: 'AI, ChatGPT, Claude, Gemini, Grok, DeepSeek, Perplexity, Dola, artificial intelligence, prompt library',
  authors: [{ name: 'RianModss' }],
  creator: 'RianModss',
  openGraph: {
    title: 'AI Collection — RianModss',
    description: 'Koleksi website AI terbaik & prompt library by RianModss',
    type: 'website',
    locale: 'id_ID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Collection — RianModss',
    description: 'Koleksi website AI terbaik & prompt library by RianModss',
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: '#080808',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#080808] text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
