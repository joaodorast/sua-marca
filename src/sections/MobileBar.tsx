import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { requestBooking } from '../lib/scroll'
import { ease } from '../lib/motion'

/** Barra fixa de agendamento, só em telas pequenas. Some quando o formulário está visível. */
export function MobileBar() {
  const [pastHero, setPastHero] = useState(false)
  const [bookingVisible, setBookingVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    const target = document.getElementById('agendar')
    const io = target
      ? new IntersectionObserver(([e]) => setBookingVisible(e.isIntersecting), { threshold: 0.05 })
      : null
    if (target && io) io.observe(target)
    return () => {
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
    }
  }, [])

  const show = pastHero && !bookingVisible

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: '110%' }}
          animate={{ y: 0 }}
          exit={{ y: '110%' }}
          transition={{ duration: 0.5, ease }}
          className="fixed inset-x-0 bottom-0 z-40 md:hidden"
          style={{
            paddingBottom: 'max(12px, env(safe-area-inset-bottom, 0px))',
            paddingLeft: 'max(12px, env(safe-area-inset-left, 0px))',
            paddingRight: 'max(12px, env(safe-area-inset-right, 0px))',
          }}
        >
          <button
            onClick={() => requestBooking()}
            className="flex min-h-[56px] w-full items-center justify-between rounded-full bg-wine/95 pl-6 pr-2 text-paper shadow-[0_18px_40px_-18px_rgba(59,35,41,0.7)] backdrop-blur"
          >
            <span className="font-serif text-[1.25rem] italic">Seu horário, sem pressa</span>
            <span className="rounded-full bg-blush px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-wine">
              Agendar
            </span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
