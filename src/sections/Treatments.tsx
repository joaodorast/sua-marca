import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { treatments, type Treatment } from '../config/site'
import { Img } from '../components/Img'
import { Reveal } from '../components/Reveal'
import { Button, Eyebrow } from '../components/Button'
import { requestBooking } from '../lib/scroll'

function Meta({ duration, price }: { duration?: string; price?: string }) {
  if (!duration && !price) return null
  return (
    <p className="mt-3 flex gap-5 text-[0.72rem] font-semibold uppercase tracking-label text-paper/80">
      {duration && <span>{duration}</span>}
      {price && <span>{price}</span>}
    </p>
  )
}

/* Desktop: grade editorial com tamanhos diferentes. */
const bento = [
  'lg:col-span-5 lg:row-span-2',
  'lg:col-span-4',
  'lg:col-span-3',
  'lg:col-span-3',
  'lg:col-span-4',
]

function Card({
  t,
  index,
  feature,
  className = '',
  sizes,
}: {
  t: Treatment
  index: number
  feature?: boolean
  className?: string
  sizes: string
}) {
  return (
    <article className={`group relative isolate overflow-hidden rounded-[28px] bg-blush ${className}`}>
      <Img
        photo={t.image}
        sizes={sizes}
        className="absolute inset-0 -z-10 h-full w-full"
        imgClassName="group-hover:scale-[1.06] !duration-[1600ms]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-plum/85 via-plum/25 to-transparent transition-opacity duration-700 group-hover:opacity-95"
      />

      <div className="flex h-full flex-col justify-between p-5 md:p-7">
        <div className="flex items-start justify-between gap-3">
          <span className="rounded-full bg-shell/90 px-3.5 py-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-wine backdrop-blur">
            {t.category}
          </span>
          <span className="font-serif text-lg italic text-paper/85">0{index + 1}</span>
        </div>

        <div>
          <h3
            className={`font-serif leading-[1.02] text-paper ${
              feature ? 'text-[clamp(2.2rem,3.4vw,3.2rem)]' : 'text-[clamp(1.9rem,2.3vw,2.25rem)]'
            }`}
          >
            {t.name}
          </h3>
          <div
            className={`grid transition-[grid-template-rows,opacity] duration-700 ease-silk ${
              feature
                ? 'grid-rows-[1fr] opacity-100'
                : 'grid-rows-[1fr] opacity-100 lg:grid-rows-[0fr] lg:opacity-0 lg:group-focus-within:grid-rows-[1fr] lg:group-focus-within:opacity-100 lg:group-hover:grid-rows-[1fr] lg:group-hover:opacity-100'
            }`}
          >
            <div className="overflow-hidden">
              <p className="mt-3 max-w-[40ch] text-[0.95rem] leading-relaxed text-paper/85">{t.summary}</p>
              <Meta duration={t.duration} price={t.price} />
            </div>
          </div>
          <button
            onClick={() => requestBooking(t.id)}
            className="mt-5 inline-flex min-h-[44px] items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-paper after:absolute after:inset-0 after:content-['']"
            aria-label={`${t.name}: solicitar horário`}
          >
            <span className="grid h-10 w-10 place-items-center rounded-full bg-paper text-wine transition-[transform,background-color] duration-500 ease-silk group-hover:rotate-45 group-hover:bg-petal">
              <ArrowUpRight aria-hidden className="h-4 w-4" strokeWidth={1.6} />
            </span>
            Solicitar
          </button>
        </div>
      </div>
    </article>
  )
}

export function Treatments() {
  const track = useRef<HTMLUListElement>(null)
  const [slide, setSlide] = useState(0)

  // Acompanha o cartão visível no carrossel móvel
  useEffect(() => {
    const el = track.current
    if (!el) return
    const onScroll = () => {
      const first = el.children[0] as HTMLElement | undefined
      if (!first) return
      const w = first.offsetWidth + 16
      setSlide(Math.min(treatments.length - 1, Math.round(el.scrollLeft / w)))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  const goTo = (i: number) => {
    const el = track.current
    const card = el?.children[i] as HTMLElement | undefined
    if (el && card) el.scrollTo({ left: card.offsetLeft - el.offsetLeft, behavior: 'smooth' })
  }

  return (
    <section id="tratamentos" aria-labelledby="trat-title" className="relative bg-paper py-24 md:py-36">
      <div className="gutter page">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-7">
            <Eyebrow className="mb-6">Tratamentos</Eyebrow>
            <h2 id="trat-title" className="display-lg">
              Uma carta curta, <em className="text-wine">feita para você</em>
            </h2>
          </Reveal>
          <Reveal className="md:col-span-4 md:col-start-9" delay={0.1}>
            <p className="text-stone">
              Poucos protocolos, bem conduzidos. Cada um é ajustado depois da avaliação, então a sessão que você
              recebe é sempre a sua.
            </p>
          </Reveal>
        </div>

        {/* Desktop: grade editorial */}
        <ul
          role="list"
          className="mt-16 hidden gap-4 lg:grid lg:auto-rows-[300px] lg:grid-cols-12 xl:auto-rows-[320px]"
        >
          {treatments.map((t, i) => (
            <Reveal as="li" key={t.id} delay={(i % 3) * 0.08} className={`h-full ${bento[i % bento.length]}`}>
              <Card
                t={t}
                index={i}
                feature={i === 0}
                className="h-full"
                sizes={i === 0 ? '(min-width: 1400px) 560px, 40vw' : '(min-width: 1400px) 450px, 32vw'}
              />
            </Reveal>
          ))}
        </ul>
      </div>

      {/* Mobile e tablet: carrossel com encaixe */}
      <div className="mt-12 lg:hidden">
        <ul
          ref={track}
          role="list"
          aria-label="Tratamentos"
          className="no-scrollbar gutter flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-pl-5 pb-2 md:scroll-pl-10"
        >
          {treatments.map((t, i) => (
            <li key={t.id} className="w-[82%] shrink-0 snap-start sm:w-[58%] md:w-[44%]">
              <Card t={t} index={i} className="aspect-[3/4.1]" sizes="(min-width: 768px) 44vw, 82vw" />
            </li>
          ))}
          <li aria-hidden className="w-1 shrink-0" />
        </ul>
        <div className="gutter mt-6 flex items-center justify-between">
          <div className="flex gap-2">
            {treatments.map((t, i) => (
              <button
                key={t.id}
                onClick={() => goTo(i)}
                aria-label={`Ver ${t.name}`}
                aria-current={slide === i ? 'true' : undefined}
                className="grid h-11 place-items-center"
              >
                <span
                  className={`block h-1.5 rounded-full transition-all duration-500 ease-silk ${
                    slide === i ? 'w-8 bg-wine' : 'w-1.5 bg-wine/25'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="font-serif text-lg italic tabular-nums text-stone">
            0{slide + 1} <span className="text-stone/50">/ 0{treatments.length}</span>
          </span>
        </div>
      </div>

      {/* Convite para quem ainda não sabe o que escolher */}
      <div className="gutter page mt-14 md:mt-20">
        <Reveal>
          <div className="grain relative flex flex-col gap-6 overflow-hidden rounded-[28px] bg-blush px-6 py-8 sm:px-10 md:flex-row md:items-center md:justify-between md:py-10">
            <div>
              <p className="font-serif text-[clamp(1.7rem,2.6vw,2.3rem)] leading-tight text-ink">
                Não sabe por onde começar?
              </p>
              <p className="mt-2 max-w-[48ch] text-ink/70">
                Conte o que você sente na pele e a equipe indica o protocolo mais adequado.
              </p>
            </div>
            <Button className="shrink-0" onClick={() => requestBooking('indefinido')}>
              Quero uma orientação
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
