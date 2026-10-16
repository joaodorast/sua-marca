import { photos, site } from '../config/site'
import { Img } from '../components/Img'
import { Reveal } from '../components/Reveal'
import { Button, Eyebrow } from '../components/Button'
import { requestBooking } from '../lib/scroll'

function Seal() {
  return (
    <div className="relative grid h-[112px] w-[112px] place-items-center rounded-full bg-wine text-blush shadow-[0_24px_50px_-20px_rgba(59,35,41,0.7)] md:h-[136px] md:w-[136px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full animate-spinslow" aria-hidden>
        <defs>
          <path id="offer-ring" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
        </defs>
        <text className="fill-current text-[8.6px] font-semibold uppercase tracking-[0.2em]">
          <textPath href="#offer-ring" textLength="228" lengthAdjust="spacing">
            {site.brand} · Edição da estação ·
          </textPath>
        </text>
      </svg>
      <span aria-hidden className="font-serif text-3xl italic text-petal">
        ✦
      </span>
    </div>
  )
}

export function Offer() {
  const o = site.offer
  if (!o.enabled) return null
  const hasPrice = Boolean(o.price)

  return (
    <section id="oferta" aria-labelledby="oferta-title" className="grain relative overflow-hidden bg-blush py-20 md:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[15%] top-0 h-[60vw] max-h-[760px] w-[60vw] max-w-[760px] rounded-full bg-[radial-gradient(closest-side,#EFC3CD,transparent)]"
      />
      <div className="gutter page relative">
        <div className="grid items-stretch gap-0 overflow-hidden rounded-[36px] bg-shell shadow-[0_60px_120px_-70px_rgba(117,70,83,0.6)] lg:grid-cols-12">
          {/* Imagem */}
          <div className="relative min-h-[340px] sm:min-h-[420px] lg:col-span-6 lg:min-h-[640px]">
            <Img
              photo={photos.offer}
              sizes="(min-width: 1024px) 46vw, 100vw"
              className="absolute inset-0 h-full w-full"
              imgClassName="hover:scale-[1.04] !duration-[1800ms]"
            />
            <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8">
              <Seal />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="relative flex flex-col justify-center px-6 py-12 sm:px-10 md:py-16 lg:col-span-6 lg:px-14 lg:py-20 xl:px-20">
            <Reveal>
              <Eyebrow className="mb-6">{o.eyebrow}</Eyebrow>
              <h2 id="oferta-title" className="display-md max-w-[14ch] text-ink">
                {o.title.split(',')[0]}
                {o.title.includes(',') && (
                  <>
                    , <em className="text-wine">{o.title.split(',').slice(1).join(',').trim()}</em>
                  </>
                )}
              </h2>
              <p className="mt-6 max-w-[46ch] text-ink/70">{o.description}</p>
            </Reveal>

            <Reveal delay={0.1}>
              <ul className="mt-10 grid grid-cols-2 gap-3" role="list">
                {o.includes.map((item, i) => (
                  <li
                    key={item}
                    className="flex flex-col gap-3 rounded-2xl bg-blush/70 px-4 py-4 transition-colors duration-500 hover:bg-blush md:px-5"
                  >
                    <span className="font-serif text-base italic text-burnt">0{i + 1}</span>
                    <span className="text-[0.96rem] font-medium leading-snug text-ink">{item}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 flex flex-col gap-6 border-t border-wine/15 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {hasPrice ? (
                    <p className="font-serif text-5xl leading-none text-ink">{o.price}</p>
                  ) : (
                    <>
                      <p className="eyebrow text-stone">Investimento</p>
                      <p className="mt-2 font-serif text-[1.9rem] italic leading-none text-wine">Sob consulta</p>
                    </>
                  )}
                  {(o.conditions || o.validUntil) && (
                    <p className="mt-3 text-sm text-stone">
                      {o.conditions}
                      {o.conditions && o.validUntil ? ' · ' : ''}
                      {o.validUntil && `Válido até ${o.validUntil}`}
                    </p>
                  )}
                </div>
                <Button onClick={() => requestBooking(o.treatmentId)}>Quero este ritual</Button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
