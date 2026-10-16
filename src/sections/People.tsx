import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { photos, site } from '../config/site'
import { Img } from '../components/Img'
import { Reveal } from '../components/Reveal'
import { Eyebrow } from '../components/Button'
import { ease } from '../lib/motion'

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
}

/* Como a equipe trabalha. Usado enquanto `site.team` estiver vazio:
   apresenta a abordagem, sem atribuir nomes, cargos ou registros. */
const craft = [
  {
    title: 'Escuta',
    text: 'Antes de qualquer protocolo, uma conversa sobre a sua pele, a sua rotina e o que você espera.',
    photo: photos.craft1,
    shape: 'arch',
  },
  {
    title: 'Técnica',
    text: 'Movimentos precisos, produtos escolhidos com critério e um protocolo ajustado a cada sessão.',
    photo: photos.craft2,
    shape: 'rounded-[28px]',
  },
  {
    title: 'Continuidade',
    text: 'Orientações claras para casa e acompanhamento a cada retorno, para o cuidado não parar na sala.',
    photo: photos.craft3,
    shape: 'arch',
  },
]

function Team() {
  const team = site.team
  const hasTeam = team.length > 0

  return (
    <section id="equipe" aria-labelledby="equipe-title" className="relative overflow-hidden bg-paper py-24 md:py-36">
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-b from-paper to-blush/70" />
      <div className="gutter page relative">
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <Reveal className="md:col-span-7">
            <Eyebrow className="mb-6">Especialistas</Eyebrow>
            <h2 id="equipe-title" className="display-lg">
              Mãos que <em className="text-wine">conhecem a pele</em>
            </h2>
          </Reveal>
          <Reveal className="md:col-span-4 md:col-start-9" delay={0.1}>
            <p className="text-stone">
              Uma equipe dedicada a ouvir antes de tocar. Cada atendimento é conduzido do início ao fim pela mesma
              pessoa, com atenção total a você.
            </p>
          </Reveal>
        </div>

        {hasTeam ? (
          <ul
            role="list"
            className={`mt-16 grid gap-x-6 gap-y-14 sm:grid-cols-2 md:mt-20 ${team.length >= 3 ? 'lg:grid-cols-3' : ''}`}
          >
            {team.map((m, i) => (
              <Reveal as="li" key={m.name} delay={i * 0.08} className={i % 3 === 1 ? 'lg:mt-16' : ''}>
                <div className="group">
                  {m.photo ? (
                    <Img
                      photo={m.photo}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                      className={`aspect-[4/5] ${i % 2 === 0 ? 'arch' : 'rounded-[28px]'}`}
                      imgClassName="group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="arch grid aspect-[4/5] place-items-center bg-blush font-serif text-7xl italic text-wine/60">
                      {initials(m.name)}
                    </div>
                  )}
                  <h3 className="mt-6 font-serif text-[2rem] leading-tight">{m.name}</h3>
                  <p className="eyebrow mt-1 text-roseink">
                    {m.role}
                    {m.credential ? ` · ${m.credential}` : ''}
                  </p>
                  {m.bio && <p className="mt-3 max-w-[38ch] text-stone">{m.bio}</p>}
                </div>
              </Reveal>
            ))}
          </ul>
        ) : (
          <ul role="list" className="mt-16 grid gap-x-6 gap-y-14 md:mt-20 md:grid-cols-3">
            {craft.map((c, i) => (
              <Reveal as="li" key={c.title} delay={i * 0.08} className={i === 1 ? 'md:mt-20' : ''}>
                <div className="group">
                  <div className="relative">
                    <Img
                      photo={c.photo}
                      sizes="(min-width: 768px) 30vw, 92vw"
                      className={`aspect-[4/4.8] ${c.shape}`}
                      imgClassName="group-hover:scale-[1.05] !duration-[1600ms]"
                    />
                    <span className="absolute left-5 top-5 rounded-full bg-shell/90 px-3.5 py-1.5 font-serif text-sm italic text-wine backdrop-blur md:top-auto md:bottom-5">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="mt-7 font-serif text-[2.2rem] leading-none text-ink">{c.title}</h3>
                  <p className="mt-3 max-w-[34ch] text-stone">{c.text}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

const feelings = ['Ouvida.', 'Leve.', 'Cuidada.', 'De volta a si.']

function Testimonials() {
  const list = site.testimonials
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const hasQuotes = list.length > 0

  // Destaque que percorre as palavras, sem simular depoimentos
  useEffect(() => {
    if (hasQuotes || reduce) return
    const id = window.setInterval(() => setI((v) => (v + 1) % feelings.length), 2200)
    return () => window.clearInterval(id)
  }, [hasQuotes, reduce])

  if (!hasQuotes) {
    return (
      <section aria-labelledby="sentir-title" className="grain relative overflow-hidden bg-petal py-24 md:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-[10%] top-1/2 h-[60vw] max-h-[700px] w-[60vw] max-w-[700px] -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,#F6DDE2,transparent)]"
        />
        <div className="gutter page relative grid gap-12 lg:grid-cols-12 lg:items-center">
          <Reveal className="lg:col-span-4">
            <Eyebrow className="mb-6 !text-wine">O que buscamos</Eyebrow>
            <h2 id="sentir-title" className="font-serif text-[clamp(2rem,3.2vw,2.8rem)] leading-[1.08] text-ink">
              Como queremos que você saia daqui
            </h2>
            <p className="mt-5 max-w-[36ch] text-ink/70">
              É o que orienta cada atendimento, do primeiro contato à orientação para casa.
            </p>
          </Reveal>
          <Reveal className="lg:col-span-8" delay={0.1}>
            <ul role="list" className="flex flex-col">
              {feelings.map((f, k) => (
                <li
                  key={f}
                  className="border-b border-wine/15 py-2 font-serif text-[clamp(2.8rem,7vw,6rem)] leading-[1.05] tracking-[-0.02em] first:border-t md:py-3"
                >
                  <span
                    className={`inline-block transition-[color,transform] duration-700 ease-silk ${
                      k === i ? 'translate-x-2 italic text-wine md:translate-x-4' : 'text-ink/25'
                    }`}
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    )
  }

  const t = list[i % list.length]
  const multiple = list.length > 1

  return (
    <section aria-labelledby="depo-title" className="grain relative overflow-hidden bg-petal py-24 md:py-32">
      <div className="gutter page grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <Eyebrow className="!text-wine">Quem já viveu</Eyebrow>
          <h2 id="depo-title" className="sr-only">
            Depoimentos de clientes
          </h2>
        </div>
        <figure className="md:col-span-9" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.55, ease }}
            >
              <blockquote className="font-serif text-[clamp(1.9rem,3.8vw,3.4rem)] leading-[1.15] text-ink">
                <span aria-hidden className="text-wine">“</span>
                {t.quote}
                <span aria-hidden className="text-wine">”</span>
              </blockquote>
              <figcaption className="eyebrow mt-8 text-wine">
                {t.author}
                {t.source ? <span className="text-ink/60"> · {t.source}</span> : null}
              </figcaption>
            </motion.div>
          </AnimatePresence>
          {multiple && (
            <div className="mt-10 flex items-center gap-3">
              <button
                onClick={() => setI((i - 1 + list.length) % list.length)}
                className="grid h-12 w-12 place-items-center rounded-full border border-wine/25 text-wine transition-colors hover:bg-wine hover:text-paper"
                aria-label="Depoimento anterior"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <button
                onClick={() => setI((i + 1) % list.length)}
                className="grid h-12 w-12 place-items-center rounded-full border border-wine/25 text-wine transition-colors hover:bg-wine hover:text-paper"
                aria-label="Próximo depoimento"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
              <span className="ml-3 text-sm tabular-nums text-ink/70">
                {i + 1} / {list.length}
              </span>
            </div>
          )}
        </figure>
      </div>
    </section>
  )
}

export function People() {
  return (
    <>
      <Team />
      <Testimonials />
    </>
  )
}
