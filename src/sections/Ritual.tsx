import { useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform, type MotionValue } from 'motion/react'
import { photos } from '../config/site'
import { Img } from '../components/Img'
import { Reveal } from '../components/Reveal'
import { Eyebrow } from '../components/Button'

const steps = [
  {
    n: 'I',
    title: 'Chegada',
    text: 'Chá morno, luz baixa e alguns minutos para deixar a rua lá fora. Nada começa antes de você respirar.',
    photo: photos.ritual1,
  },
  {
    n: 'II',
    title: 'Escolha',
    text: 'Você conta como está e escolhemos juntos os óleos e ativos do dia, a partir do que a sua pele mostra.',
    photo: photos.ritual2,
  },
  {
    n: 'III',
    title: 'Cuidado',
    text: 'O tratamento acontece sem interrupções, no ritmo do seu corpo, em uma sala preparada só para você.',
    photo: photos.ritual3,
  },
  {
    n: 'IV',
    title: 'Retorno',
    text: 'Um tempo de descanso e orientações simples para levar o cuidado para casa e prolongar o resultado.',
    photo: photos.ritual4,
  },
]

const total = steps.length

/** Barra que enche conforme a rolagem avança dentro de uma etapa. */
function StepProgress({ progress, i, className = '' }: { progress: MotionValue<number>; i: number; className?: string }) {
  const scaleX = useTransform(progress, [i / total, (i + 1) / total], [0, 1])
  return (
    <span aria-hidden className={`block h-[2px] overflow-hidden rounded-full bg-shell/15 ${className}`}>
      <motion.span style={{ scaleX }} className="block h-full origin-left bg-petal" />
    </span>
  )
}

/**
 * Imagens empilhadas: a cada etapa a nova foto desce sobre a anterior como uma
 * cortina, e a anterior recua levemente. Rolando para cima, o movimento se desfaz.
 */
function Stage({ active, className = '', sizes }: { active: number; className?: string; sizes: string }) {
  return (
    <div className={`arch relative isolate overflow-hidden bg-wine ${className}`}>
      {steps.map((s, i) => {
        const shown = i <= active
        return (
          <div
            key={s.n}
            aria-hidden={active !== i}
            className="absolute inset-0 transition-[clip-path] duration-[1100ms] ease-silk"
            style={{ zIndex: i, clipPath: shown ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' }}
          >
            <div
              className="h-full w-full transition-transform duration-[1400ms] ease-silk"
              style={{
                transform: i < active ? 'scale(1.06) translateY(4%)' : shown ? 'scale(1)' : 'scale(1.12) translateY(-6%)',
              }}
            >
              <Img photo={s.photo} sizes={sizes} className="h-full w-full" />
            </div>
          </div>
        )
      })}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-plum/85 via-plum/30 to-transparent"
      />
      {/* legenda que acompanha a etapa */}
      <div className="absolute inset-x-0 bottom-6 z-10 grid text-center md:bottom-8">
        {steps.map((s, i) => (
          <div
            key={s.n}
            aria-hidden={active !== i}
            className={`col-start-1 row-start-1 transition-[opacity,transform] duration-700 ease-silk ${
              active === i ? 'translate-y-0 opacity-100' : i < active ? '-translate-y-3 opacity-0' : 'translate-y-3 opacity-0'
            }`}
          >
            <p className="font-serif text-[1.05rem] italic text-petal">Tempo {s.n}</p>
            <p className="mt-1 font-serif text-[clamp(2.4rem,3.6vw,3.6rem)] leading-none text-shell">{s.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Etapa nas laterais da imagem (desktop). Clicar leva a rolagem até ela. */
function StepCard({
  i,
  active,
  progress,
  onSelect,
}: {
  i: number
  active: boolean
  progress: MotionValue<number>
  onSelect: (i: number) => void
}) {
  const s = steps[i]
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(i)}
        aria-current={active ? 'step' : undefined}
        className={`group relative w-full overflow-hidden rounded-[24px] border p-6 text-left transition-[background-color,border-color,opacity] duration-700 ease-silk xl:p-7 ${
          active
            ? 'border-petal/40 bg-shell/[0.07] opacity-100'
            : 'border-shell/10 bg-transparent opacity-50 hover:opacity-80'
        }`}
      >
        <span className="flex items-center gap-4">
          <span
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-serif text-lg italic transition-colors duration-700 ${
              active ? 'bg-petal text-plum' : 'bg-shell/10 text-petal'
            }`}
          >
            {s.n}
          </span>
          <span className="font-serif text-[clamp(1.9rem,2.4vw,2.5rem)] leading-none text-shell">{s.title}</span>
        </span>
        <span className="mt-4 block text-[0.98rem] leading-relaxed text-blush/80">{s.text}</span>
        <StepProgress progress={progress} i={i} className="absolute inset-x-6 bottom-0 xl:inset-x-7" />
      </button>
    </li>
  )
}

export function Ritual() {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  // Progresso da rolagem enquanto o palco está fixo na tela
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setActive(Math.min(total - 1, Math.max(0, Math.floor(v * total))))
  })

  /** Rola até o trecho da etapa escolhida. */
  const goTo = (i: number) => {
    const el = track.current
    if (!el) return
    const range = el.offsetHeight - window.innerHeight
    const top = el.getBoundingClientRect().top + window.scrollY + (range * (i + 0.15)) / total
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  }

  const current = steps[active]

  return (
    <section id="ritual" aria-labelledby="ritual-title" className="relative overflow-clip bg-plum text-shell">
      {/* brilho rosado de fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[30%] h-[80vw] max-h-[1000px] w-[80vw] max-w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(199,127,145,0.3),transparent)]"
      />

      <div className="gutter page relative pt-24 md:pt-32">
        <div className="grid gap-8 md:grid-cols-12 md:items-end lg:text-center">
          <Reveal className="md:col-span-7 lg:col-span-8 lg:col-start-3">
            <Eyebrow tone="light" className="mb-6 lg:justify-center">
              A experiência
            </Eyebrow>
            <h2 id="ritual-title" className="display-lg text-shell">
              O ritual, em <em className="text-petal">quatro tempos</em>
            </h2>
          </Reveal>
          <Reveal className="md:col-span-4 md:col-start-9 lg:col-span-6 lg:col-start-4" delay={0.1}>
            <p className="text-blush/75 lg:mx-auto lg:max-w-[46ch]">
              Da porta de entrada ao último gole de chá, cada etapa tem um propósito: desacelerar.
            </p>
          </Reveal>
        </div>
      </div>

      {/* Trilho de rolagem: o palco fica fixo enquanto as quatro etapas passam */}
      <div ref={track} className="relative h-[330svh] lg:h-[370svh]">
        <div className="sticky top-0 flex h-[100svh] flex-col">
          {/* Desktop: imagem no centro, etapas dos dois lados */}
          <div className="gutter page hidden flex-1 items-center pt-16 lg:flex">
            <div className="grid w-full grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)] items-center gap-6 xl:gap-8">
              <ol className="flex flex-col gap-4" aria-label="Etapas do ritual, parte 1">
                {[0, 1].map((i) => (
                  <StepCard key={i} i={i} active={active === i} progress={scrollYProgress} onSelect={goTo} />
                ))}
              </ol>

              <div>
                <Stage
                  active={active}
                  sizes="(min-width: 1400px) 560px, 40vw"
                  className="mx-auto h-[min(72svh,700px)] min-h-[460px] shadow-[0_60px_120px_-50px_rgba(0,0,0,0.6)]"
                />
                <p className="mt-5 text-center font-serif text-base italic text-blush/60" aria-live="polite">
                  {current.n} <span className="text-blush/30">/ IV</span>
                </p>
              </div>

              <ol start={3} className="flex flex-col gap-4" aria-label="Etapas do ritual, parte 2">
                {[2, 3].map((i) => (
                  <StepCard key={i} i={i} active={active === i} progress={scrollYProgress} onSelect={goTo} />
                ))}
              </ol>
            </div>
          </div>

          {/* Mobile e tablet: imagem grande, texto da etapa e navegação I–IV */}
          <div
            className="gutter flex min-h-0 flex-1 flex-col pt-[84px] lg:hidden"
            style={{ paddingBottom: 'max(96px, calc(env(safe-area-inset-bottom, 0px) + 84px))' }}
          >
            <Stage
              active={active}
              sizes="(min-width: 768px) 70vw, 92vw"
              className="mx-auto min-h-0 w-full max-w-[520px] flex-1 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)]"
            />

            <div className="mx-auto mt-5 grid w-full max-w-[520px]" aria-live="polite">
              {steps.map((s, i) => (
                <p
                  key={s.n}
                  aria-hidden={active !== i}
                  className={`col-start-1 row-start-1 text-center text-[0.98rem] leading-relaxed text-blush/85 transition-[opacity,transform] duration-700 ease-silk ${
                    active === i ? 'translate-y-0 opacity-100' : i < active ? '-translate-y-2 opacity-0' : 'translate-y-2 opacity-0'
                  }`}
                >
                  {s.text}
                </p>
              ))}
            </div>

            <ol className="mx-auto mt-5 grid w-full max-w-[520px] grid-cols-4 gap-3" aria-label="Etapas do ritual">
              {steps.map((s, i) => (
                <li key={s.n}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    aria-current={active === i ? 'step' : undefined}
                    aria-label={`Tempo ${s.n}: ${s.title}`}
                    className="flex min-h-[44px] w-full flex-col justify-center gap-2"
                  >
                    <span
                      className={`font-serif text-[1.05rem] italic leading-none transition-colors duration-500 ${
                        active === i ? 'text-petal' : 'text-blush/40'
                      }`}
                    >
                      {s.n}
                    </span>
                    <StepProgress progress={scrollYProgress} i={i} className="w-full" />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
