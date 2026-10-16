import { useEffect, useRef, useState } from 'react'
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

/* Desktop: cartões em zigue-zague (I esquerda, II direita, III esquerda, IV direita),
   cada um ocupando duas faixas da grade para que se sobreponham em altura. */
const placement = [
  'col-start-1 row-start-1 row-span-2',
  'col-start-3 row-start-2 row-span-2',
  'col-start-1 row-start-3 row-span-2',
  'col-start-3 row-start-4 row-span-2',
]

/**
 * Imagens empilhadas: a cada etapa a nova foto desce sobre a anterior como uma
 * cortina, e a anterior recua levemente. Voltando, o movimento se desfaz.
 */
function Stage({ active }: { active: number }) {
  return (
    <div className="arch relative isolate h-[min(66svh,640px)] min-h-[440px] overflow-hidden bg-wine shadow-[0_60px_120px_-50px_rgba(0,0,0,0.6)]">
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
              <Img photo={s.photo} sizes="(min-width: 1400px) 560px, 40vw" className="h-full w-full" />
            </div>
          </div>
        )
      })}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-10 h-1/2 bg-gradient-to-t from-plum/85 via-plum/30 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-8 z-10 grid text-center" aria-live="polite">
        {steps.map((s, i) => (
          <div
            key={s.n}
            aria-hidden={active !== i}
            className={`col-start-1 row-start-1 transition-[opacity,transform] duration-700 ease-silk ${
              active === i ? 'translate-y-0 opacity-100' : i < active ? '-translate-y-3 opacity-0' : 'translate-y-3 opacity-0'
            }`}
          >
            <p className="font-serif text-[1.05rem] italic text-petal">Tempo {s.n}</p>
            <p className="mt-1 font-serif text-[clamp(2.4rem,3.4vw,3.4rem)] leading-none text-shell">{s.title}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export function Ritual() {
  const [active, setActive] = useState(0)
  const cards = useRef<(HTMLButtonElement | null)[]>([])

  // Etapa ativa = cartão mais próximo do centro da tela (rolagem natural, sem travar a página)
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const mid = window.innerHeight / 2
      let best = 0
      let bestDist = Infinity
      cards.current.forEach((el, i) => {
        if (!el || !el.offsetParent) return
        const r = el.getBoundingClientRect()
        const d = Math.abs(r.top + r.height / 2 - mid)
        if (d < bestDist) {
          bestDist = d
          best = i
        }
      })
      setActive(best)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  const goTo = (i: number) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    cards.current[i]?.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <section id="ritual" aria-labelledby="ritual-title" className="relative overflow-clip bg-plum py-24 text-shell md:py-32">
      {/* brilho rosado atrás da imagem central */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[45%] h-[80vw] max-h-[1000px] w-[80vw] max-w-[1000px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(199,127,145,0.3),transparent)]"
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

        {/* Desktop: imagem no centro acompanha a rolagem; etapas dos dois lados */}
        <div className="mt-16 hidden lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)] lg:grid-rows-[repeat(6,minmax(22svh,auto))] lg:gap-x-6 xl:gap-x-8">
          <div className="col-start-2 row-span-6 row-start-1">
            <div className="sticky top-[calc((100svh_-_min(66svh,640px))/2_+_28px)]">
              <Stage active={active} />
              <p className="mt-5 text-center font-serif text-base italic text-blush/60">
                {steps[active].n} <span className="text-blush/30">/ IV</span>
              </p>
            </div>
          </div>

          {steps.map((s, i) => {
            const on = active === i
            return (
              <div key={s.n} className={`flex items-center ${placement[i]}`}>
                <button
                  ref={(el) => {
                    cards.current[i] = el
                  }}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-current={on ? 'step' : undefined}
                  className={`group relative w-full overflow-hidden rounded-[24px] border p-6 text-left transition-[background-color,border-color,opacity,transform] duration-700 ease-silk xl:p-7 ${
                    on
                      ? 'border-petal/40 bg-shell/[0.07] opacity-100'
                      : 'border-shell/10 bg-transparent opacity-50 hover:opacity-80'
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span
                      className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-serif text-lg italic transition-colors duration-700 ${
                        on ? 'bg-petal text-plum' : 'bg-shell/10 text-petal'
                      }`}
                    >
                      {s.n}
                    </span>
                    <span className="font-serif text-[clamp(1.9rem,2.4vw,2.5rem)] leading-none text-shell">{s.title}</span>
                  </span>
                  <span className="mt-4 block text-[0.98rem] leading-relaxed text-blush/80">{s.text}</span>
                  <span
                    aria-hidden
                    className={`absolute inset-x-6 bottom-0 h-[2px] origin-left rounded-full bg-petal transition-transform duration-700 ease-silk xl:inset-x-7 ${
                      on ? 'scale-x-100' : 'scale-x-0'
                    }`}
                  />
                </button>
              </div>
            )
          })}
        </div>
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
