import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { photos, site } from '../config/site'
import { Img } from '../components/Img'
import { Reveal } from '../components/Reveal'
import { Eyebrow } from '../components/Button'

const principles = [
  {
    title: 'Avaliação antes do protocolo',
    text: 'Toda sessão começa por entender a sua pele, a sua rotina e o que você espera do cuidado.',
  },
  {
    title: 'Ativos escolhidos com critério',
    text: 'Usamos o que faz sentido para você, na concentração certa, sem excessos nem modismos.',
  },
  {
    title: 'Tempo de verdade',
    text: 'Agenda sem sobreposição, para que nenhum atendimento termine às pressas.',
  },
]

export function Manifesto() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const photoY = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-6%', '6%'])
  const detailY = useTransform(scrollYProgress, [0, 1], reduce ? ['0px', '0px'] : ['60px', '-60px'])

  return (
    <section
      ref={ref}
      aria-labelledby="manifesto-title"
      className="relative overflow-hidden bg-shell py-24 md:py-36"
    >
      {/* faixa rosada vertical atrás da foto */}
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 hidden w-[38%] bg-gradient-to-b from-blush via-blush/70 to-shell lg:block"
      />

      <div className="gutter page relative grid gap-14 lg:grid-cols-12 lg:gap-x-12">
        {/* Foto */}
        <div className="relative order-2 lg:order-1 lg:col-span-5">
          <Reveal y={40}>
            <div className="arch relative mx-auto aspect-[4/5.2] w-[86%] max-w-[480px] overflow-hidden lg:mx-0 lg:w-full">
              <motion.div style={{ y: photoY }} className="absolute -inset-y-[8%] inset-x-0">
                <Img
                  photo={photos.manifesto}
                  sizes="(min-width: 1024px) 34vw, 86vw"
                  className="h-full w-full"
                />
              </motion.div>
            </div>
          </Reveal>
          <motion.div
            style={{ y: detailY }}
            className="absolute -bottom-8 right-0 w-[38%] max-w-[210px] lg:-right-10 lg:bottom-10"
          >
            <div className="rounded-full bg-shell p-1.5 shadow-[0_30px_60px_-30px_rgba(117,70,83,0.55)]">
              <Img
                photo={photos.manifestoDetail}
                sizes="210px"
                maxWidth={480}
                className="aspect-square rounded-full"
              />
            </div>
          </motion.div>
        </div>

        {/* Texto */}
        <div className="order-1 lg:order-2 lg:col-span-7 lg:col-start-6 lg:pl-8 lg:pt-6">
          <Reveal>
            <Eyebrow className="mb-8 md:mb-10">Manifesto</Eyebrow>
            <h2
              id="manifesto-title"
              className="font-serif text-[clamp(2.1rem,4.4vw,3.9rem)] font-normal leading-[1.08] tracking-[-0.015em] text-ink"
            >
              Cuidar da pele é também cuidar do próprio ritmo. Cada sessão começa com uma conversa, segue sem
              pressa e termina quando você se sente <em className="text-wine">de volta a si.</em>
            </h2>
          </Reveal>

          <ol className="mt-14 md:mt-20" role="list">
            {principles.map((p, i) => (
              <Reveal
                as="li"
                key={p.title}
                delay={i * 0.08}
                className="group grid grid-cols-[3rem_1fr] gap-x-4 border-t border-wine/15 py-6 last:border-b md:grid-cols-[4rem_minmax(0,16rem)_1fr] md:gap-x-8 md:py-7"
              >
                <span className="font-serif text-[1.6rem] italic leading-none text-burnt transition-transform duration-500 ease-silk group-hover:translate-x-1">
                  0{i + 1}
                </span>
                <h3 className="font-serif text-[1.55rem] leading-tight text-ink">{p.title}</h3>
                <p className="col-start-2 mt-2 max-w-[38ch] text-[0.98rem] text-stone md:col-start-3 md:mt-0">
                  {p.text}
                </p>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-10 flex items-center gap-4">
            <span className="h-px w-12 bg-burnt" aria-hidden />
            <span className="font-serif text-xl italic text-wine">a equipe {site.brand}</span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
