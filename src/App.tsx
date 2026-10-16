import { Header } from './sections/Header'
import { Hero } from './sections/Hero'
import { Manifesto } from './sections/Manifesto'
import { Treatments } from './sections/Treatments'
import { Ritual } from './sections/Ritual'
import { Offer } from './sections/Offer'
import { People } from './sections/People'
import { Booking } from './sections/Booking'
import { Closing } from './sections/Closing'
import { Footer } from './sections/Footer'
import { MobileBar } from './sections/MobileBar'

export default function App() {
  return (
    <>
      <a
        href="#conteudo"
        className="fixed left-4 top-3 z-[60] -translate-y-20 rounded-full bg-ink px-5 py-3 text-sm text-paper transition-transform focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <Manifesto />
        <Treatments />
        <Ritual />
        <Offer />
        <People />
        <Booking />
        <Closing />
      </main>
      <Footer />
      <MobileBar />
    </>
  )
}
