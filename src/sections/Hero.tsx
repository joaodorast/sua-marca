import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { ArrowDownRight } from 'lucide-react'
import { photos, site, treatments } from '../config/site'
import { Img } from '../components/Img'
import { Button } from '../components/Button'
import { requestBooking, scrollToId } from '../lib/scroll'
import { ease } from '../lib/motion'

const lines: { text: string; italic?: boolean; indent?: boolean }[] = [
  { text: 'Devagar,' },
  { text: 'a pele', indent: true },
  { text: 'floresce.', italic: true },
]

const promises = ['Avaliação antes do protocolo', 'Agenda sem pressa', 'Ativos com critério']

function Marquee() {
  const items = [...treatments.map((t) => t.name), 'Bem-estar', 'Skincare']
  const row = (hidden?: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden} role="list">
      {items.map((t) => (
        <li key={t} className="flex items-center">
          <span className="whitespace-nowrap px-6 font-serif text-[1.35rem] italic text-blush md:px-9 md:text-[1.7rem]">
            {t}
          </span>
          <span aria-hidden className="text-[0.7rem] text-rose">
            ✦
          </span>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="relative overflow-hidden bg-wine py-4 md:py-5" aria-label="Tratamentos em destaque">
      <div className="flex w-max animate-marquee motion-reduce:animate-none">
        {row()}
        {row(true)}
      </div>
    </div>
  )
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '10%'])
  const detailY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-40%'])
  const haloY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '20%'])

  return (
    <section id="topo" ref={ref} aria-labelledby="hero-title" className="grain relative overflow-hidden bg-blush">
      {/* halos: dão profundidade ao rosa sem pesar */}
      <motion.div
        aria-hidden
        style={{ y: haloY }}
        className="pointer-events-none absolute -right-[12%] -top-[10%] h-[80vw] max-h-[1000px] w-[80vw] max-w-[1000px] rounded-full bg-[radial-gradient(closest-side,#EFC3CD,transparent)] opacity-90"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[30%] -left-[20%] h-[70vw] max-h-[800px] w-[70vw] max-w-[800px] rounded-full bg-[radial-gradient(closest-side,#FCF5F6,transparent)] opacity-80"
      />

      <div className="gutter page relative grid grid-cols-1 gap-y-10 pb-14 pt-[100px] md:pt-[128px] lg:min-h-[min(100svh,980px)] lg:grid-cols-12 lg:items-center lg:gap-x-10 lg:pb-20">
        {/* Texto */}
        <div className="relative z-10 lg:col-span-6 xl:col-span-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.1 }}
            className="eyebrow mb-7 flex items-center gap-3 text-roseink md:mb-10"
          >
            <span className="h-px w-8 bg-burnt" aria-hidden />
            Estética · Spa · Bem-estar
          </motion.div>

          <h1 id="hero-title" className="display-xl text-ink">
            {lines.map((l, i) => (
              <span key={l.text} className="block overflow-hidden pb-[0.1em]">
                <motion.span
                  className={`block ${l.italic ? 'italic text-wine' : ''} ${l.indent ? 'pl-[0.85em]' : ''}`}
                  initial={reduce ? false : { y: '105%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.15, ease, delay: 0.15 + i * 0.12 }}
                >
                  {l.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.7 }}
            className="mt-8 hidden md:mt-10 lg:block"
          >
            <HeroCopy />
          </motion.div>
        </div>

        {/* Fotografia */}
        <div className="relative lg:col-span-6">
          <motion.div
            initial={reduce ? false : { clipPath: 'inset(100% 0 0 0 round 999px 999px 32px 32px)' }}
            animate={{ clipPath: 'inset(0% 0 0 0 round 999px 999px 32px 32px)' }}
            transition={{ duration: 1.4, ease, delay: 0.05 }}
            className="relative mx-auto aspect-[4/4.6] w-full max-w-[600px] overflow-hidden rounded-[999px_999px_32px_32px] shadow-[0_60px_120px_-60px_rgba(117,70,83,0.55)] sm:aspect-[4/4.2] lg:ml-auto lg:mr-0 lg:aspect-auto lg:h-[min(76svh,760px)]"
          >
            <motion.div style={{ y: imgY }} className="absolute -inset-y-[7%] inset-x-0">
              <Img
                photo={photos.hero}
                priority
                sizes="(min-width: 1024px) 600px, 92vw"
                className="h-full w-full"
              />
            </motion.div>
            {/* véu rosado na base, integra a foto ao fundo */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-wine/35 to-transparent"
            />
            <p className="absolute bottom-6 left-0 right-0 text-center font-serif text-[1.05rem] italic text-paper/95 md:bottom-8 md:text-[1.2rem]">
              Edição de primavera
            </p>
          </motion.div>

          {/* detalhe: rolo de quartzo rosa em arco sobreposto */}
          <motion.div
            style={{ y: detailY }}
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease, delay: 0.9 }}
            className="absolute -bottom-6 left-0 w-[30%] max-w-[190px] sm:left-[4%] lg:-left-[14%] lg:bottom-[10%] lg:w-[30%]"
          >
            <div className="arch bg-shell p-1.5 shadow-[0_30px_60px_-28px_rgba(117,70,83,0.6)]">
              <Img photo={photos.heroDetail} sizes="190px" maxWidth={480} className="arch aspect-[3/4]" />
            </div>
          </motion.div>

          {/* selo circular giratório */}
          <motion.button
            type="button"
            onClick={() => scrollToId('oferta')}
            initial={reduce ? false : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease, delay: 1.1 }}
            className="group absolute -right-1 top-[6%] grid h-[104px] w-[104px] place-items-center rounded-full bg-shell/90 text-wine shadow-[0_20px_50px_-24px_rgba(117,70,83,0.6)] backdrop-blur sm:right-[4%] md:h-[128px] md:w-[128px] lg:-right-4"
            aria-label="Ver o ritual da estação"
          >
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spinslow" aria-hidden>
              <defs>
                <path id="hero-ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <text className="fill-current text-[8.4px] font-semibold uppercase tracking-[0.2em]">
                <textPath href="#hero-ring" textLength="232" lengthAdjust="spacing">
                  Ritual da estação · Primeira visita ·
                </textPath>
              </text>
            </svg>
            <ArrowDownRight
              aria-hidden
              strokeWidth={1.3}
              className="h-6 w-6 transition-transform duration-500 ease-silk group-hover:rotate-[-45deg]"
            />
          </motion.button>
        </div>

        {/* Texto de apoio no mobile/tablet, depois da foto */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.6 }}
          className="pt-4 lg:hidden"
        >
          <HeroCopy />
        </motion.div>
      </div>

      <Marquee />
      <p className="sr-only">{site.brand}</p>
    </section>
  )
}

function HeroCopy() {
  return (
    <>
      <p className="lede !text-ink/70">
        Tratamentos faciais, corporais e rituais de spa conduzidos com calma e técnica. Você chega como está e sai
        com a pele, e a cabeça, mais leves.
      </p>
      <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button onClick={() => requestBooking()}>Solicitar horário</Button>
        <Button variant="ghost" arrow={false} onClick={() => scrollToId('tratamentos')}>
          Conhecer tratamentos
        </Button>
      </div>
      <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-wine/15 pt-6" role="list">
        {promises.map((p) => (
          <li key={p} className="flex items-center gap-2 text-[0.86rem] text-ink/70">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-burnt" />
            {p}
          </li>
        ))}
      </ul>
    </>
  )
}
