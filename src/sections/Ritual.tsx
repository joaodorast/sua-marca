import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
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

const STEP_MS = 5200

/** Etapa clicável nas laterais da imagem central (desktop). */
function StepButton({
  s,
  i,
  active,
  paused,
  onSelect,
}: {
  s: (typeof steps)[number]
  i: number
  active: boolean
  paused: boolean
  onSelect: (i: number) => void
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect(i)}
        onMouseEnter={() => onSelect(i)}
        onFocus={() => onSelect(i)}
        aria-pressed={active}
        className={`group relative w-full overflow-hidden rounded-[24px] border p-6 text-left transition-[background-color,border-color,opacity] duration-700 ease-silk xl:p-7 ${
          active
            ? 'border-petal/40 bg-shell/[0.07] opacity-100'
            : 'border-shell/10 bg-transparent opacity-60 hover:opacity-90'
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
        {/* progresso da etapa ativa */}
        <span aria-hidden className="absolute inset-x-6 bottom-0 h-px overflow-hidden bg-shell/10 xl:inset-x-7">
          <span
            key={active ? `on-${i}` : `off-${i}`}
            className="block h-full origin-left bg-petal"
            style={
              active
                ? {
                    animation: `ritual-progress ${STEP_MS}ms linear forwards`,
                    animationPlayState: paused ? 'paused' : 'running',
                  }
                : { transform: 'scaleX(0)' }
            }
          />
        </span>
      </button>
    </li>
  )
}

export function Ritual() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [inView, setInView] = useState(false)
  const reduce = useReducedMotion()
  const stage = useRef<HTMLDivElement>(null)

  // Só avança sozinho enquanto a seção está na tela
  useEffect(() => {
    const el = stage.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (paused || !inView || reduce) return
    const id = window.setTimeout(() => setActive((v) => (v + 1) % steps.length), STEP_MS)
    return () => window.clearTimeout(id)
  }, [active, paused, inView, reduce])

  const current = steps[active]

  return (
    <section id="ritual" aria-labelledby="ritual-title" className="relative overflow-hidden bg-plum py-24 text-shell md:py-32">
      {/* brilho rosado atrás da imagem central */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[55%] h-[80vw] max-h-[1000px] w-[80vw] max-w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(199,127,145,0.32),transparent)]"
      />

      <div className="gutter page relative">
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

        {/* Desktop: imagem no centro, etapas dos dois lados */}
        <Reveal y={40}>
          <div
            ref={stage}
            className="mt-16 hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center lg:gap-6 xl:gap-8"
            onMouseLeave={() => setPaused(false)}
            onMouseEnter={() => setPaused(true)}
          >
            <ol className="flex flex-col gap-4" aria-label="Etapas do ritual, parte 1">
              {steps.slice(0, 2).map((s, k) => (
                <StepButton key={s.n} s={s} i={k} active={active === k} paused={paused} onSelect={setActive} />
              ))}
            </ol>

            <div className="relative">
              <div className="arch relative mx-auto h-[min(72vh,700px)] min-h-[520px] overflow-hidden shadow-[0_60px_120px_-50px_rgba(0,0,0,0.6)]">
                {steps.map((s, i) => (
                  <div
                    key={s.n}
                    aria-hidden={active !== i}
                    className={`absolute inset-0 transition-[opacity,transform] duration-[1100ms] ease-silk ${
                      active === i ? 'scale-100 opacity-100' : 'scale-[1.06] opacity-0'
                    }`}
                  >
                    <Img photo={s.photo} sizes="(min-width: 1400px) 560px, 40vw" className="h-full w-full" />
                  </div>
                ))}
                <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-plum/85 via-plum/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-8 text-center" aria-live="polite">
                  <p className="font-serif text-[1.1rem] italic text-petal">Tempo {current.n}</p>
                  <p className="mt-1 font-serif text-[clamp(2.6rem,3.6vw,3.6rem)] leading-none text-shell">{current.title}</p>
                </div>
              </div>
              {/* indicadores sob a imagem */}
              <div className="mt-6 flex justify-center gap-2" aria-hidden>
                {steps.map((s, i) => (
                  <span
                    key={s.n}
                    className={`h-1.5 rounded-full transition-all duration-500 ease-silk ${
                      active === i ? 'w-8 bg-petal' : 'w-1.5 bg-shell/25'
                    }`}
                  />
                ))}
              </div>
            </div>

            <ol start={3} className="flex flex-col gap-4" aria-label="Etapas do ritual, parte 2">
              {steps.slice(2).map((s, k) => (
                <StepButton key={s.n} s={s} i={k + 2} active={active === k + 2} paused={paused} onSelect={setActive} />
              ))}
            </ol>
          </div>
        </Reveal>
      </div>

      {/* Mobile e tablet: etapas empilhadas, cada uma com sua imagem */}
      <ol className="gutter page mt-14 grid gap-14 sm:grid-cols-2 sm:gap-x-6 lg:hidden" aria-label="Etapas do ritual">
        {steps.map((s, i) => (
          <Reveal as="li" key={s.n} delay={(i % 2) * 0.08}>
            <figure>
              <div className="relative">
                <Img
                  photo={s.photo}
                  sizes="(min-width: 640px) 46vw, 92vw"
                  maxWidth={1080}
                  className={`aspect-[4/4.4] ${i % 2 === 0 ? 'arch' : 'rounded-[28px]'}`}
                />
                <span className="absolute -bottom-6 right-5 grid h-14 w-14 place-items-center rounded-full bg-petal font-serif text-xl italic text-plum">
                  {s.n}
                </span>
              </div>
              <figcaption className="mt-6">
                <span className="block font-serif text-[2.4rem] leading-none text-shell">{s.title}</span>
                <span className="mt-3 block max-w-[36ch] text-blush/80">{s.text}</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
