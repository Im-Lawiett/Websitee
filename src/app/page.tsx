import Header from '@/components/Header'
import Hero from '@/components/Hero'
import AIToolsSection from '@/components/AIToolsSection'
import PromptSection from '@/components/PromptSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#080808]">
      {/* Background mesh */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)' }} />
      </div>

      <Header />
      <Hero />
      <AIToolsSection />
      <PromptSection />
      <Footer />
    </main>
  )
}
