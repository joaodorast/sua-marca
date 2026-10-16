import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { nav, photos, site } from '../config/site'
import { requestBooking, scrollToId } from '../lib/scroll'
import { ease } from '../lib/motion'
import { Img } from '../components/Img'
import { ButtonFill, buttonBase, buttonVariants } from '../components/Button'

export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`font-serif tracking-[-0.01em] ${className}`}>
      {site.brand}
      <span className="text-burnt">.</span>
    </span>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeId, setActiveId] = useState('')
  const menuBtn = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Destaca no menu a seção que está na tela
  useEffect(() => {
    const ids = ['topo', ...nav.map((n) => n.href.slice(1))]
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActiveId(e.target.id))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    ids.forEach((id) => {
      const el = document.getElementById(id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : ''
    document.body.dataset.menu = open ? 'open' : ''
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const close = () => {
    setOpen(false)
    menuBtn.current?.focus()
  }

  const go = (href: string) => {
    setOpen(false)
    requestAnimationFrame(() => scrollToId(href))
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-500 ease-silk ${
          scrolled ? 'bg-shell/80 shadow-[0_1px_0_rgba(117,70,83,0.10)] backdrop-blur-xl' : 'bg-transparent'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div
          className={`gutter page flex items-center justify-between transition-[height] duration-500 ease-silk ${
            scrolled ? 'h-16' : 'h-[72px] md:h-24'
          }`}
        >
          <a
            href="#topo"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="text-[1.7rem] leading-none text-ink md:text-[2rem]"
            aria-label={`${site.brand}, voltar ao início`}
          >
            <Wordmark />
          </a>

          <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const on = activeId === item.href.slice(1)
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={on ? 'true' : undefined}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToId(item.href)
                  }}
                  className={`relative rounded-full px-4 py-2 text-[0.76rem] font-medium uppercase tracking-[0.16em] transition-colors duration-300 ${
                    on ? 'text-wine' : 'text-ink/75 hover:text-wine'
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-paper/70 shadow-[inset_0_0_0_1px_rgba(117,70,83,0.12)]"
                      transition={{ duration: 0.5, ease }}
                    />
                  )}
                  {item.label}
                </a>
              )
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => requestBooking()}
              className={`${buttonBase} ${buttonVariants.solid.cls} hidden !min-h-[44px] !px-6 !text-[0.72rem] sm:inline-flex`}
            >
              <ButtonFill variant="solid" />
              Agendar
            </button>
            <button
              ref={menuBtn}
              onClick={() => setOpen(true)}
              className="inline-flex h-11 items-center gap-3 rounded-full bg-paper/60 pl-4 pr-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-ink backdrop-blur lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
            >
              Menu
              <span aria-hidden className="flex w-5 flex-col gap-[5px]">
                <span className="h-px w-full bg-ink" />
                <span className="h-px w-2/3 self-end bg-ink" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="menu-mobile"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="grain fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-blush"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease }}
            style={{
              paddingTop: 'env(safe-area-inset-top, 0px)',
              paddingBottom: 'max(24px, env(safe-area-inset-bottom, 0px))',
            }}
          >
            <div className="gutter flex h-[72px] shrink-0 items-center justify-between">
              <Wordmark className="text-[1.7rem]" />
              <button
                autoFocus
                onClick={close}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-paper/70 text-ink"
                aria-label="Fechar menu"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>

            <div className="gutter mt-4 flex items-center gap-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.8, ease }}
              >
                <Img photo={photos.heroDetail} sizes="96px" maxWidth={480} className="arch h-24 w-20" />
              </motion.div>
              <p className="max-w-[22ch] font-serif text-[1.25rem] italic leading-snug text-wine">
                Estética, spa e bem-estar, no seu tempo.
              </p>
            </div>

            <nav aria-label="Menu móvel" className="gutter mt-8 flex flex-1 flex-col">
              {nav.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    go(item.href)
                  }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.7, ease }}
                  className="group flex items-baseline gap-4 border-b border-wine/15 py-4"
                >
                  <span className="w-6 font-serif text-sm italic text-roseink">0{i + 1}</span>
                  <span className="font-serif text-[2.5rem] leading-none text-ink transition-colors group-active:text-wine">
                    {item.label}
                  </span>
                </motion.a>
              ))}
            </nav>

            <motion.div
              className="gutter mt-8"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6, ease }}
            >
              <button
                onClick={() => {
                  setOpen(false)
                  requestAnimationFrame(() => requestBooking())
                }}
                className="flex min-h-[58px] w-full items-center justify-center rounded-full bg-wine text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-paper"
              >
                Solicitar horário
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
