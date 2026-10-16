import { photos, site, type Photo } from '../config/site'
import { Img } from '../components/Img'
import { Reveal } from '../components/Reveal'
import { Button, Eyebrow, buttonBase, buttonVariants, ButtonFill } from '../components/Button'
import { requestBooking } from '../lib/scroll'
import { whatsappHref } from '../lib/contact'

/** Fotografia embutida na linha do título. */
function Pill({ photo, className = '' }: { photo: Photo; className?: string }) {
  return (
    <span className="relative mx-[0.12em] inline-block translate-y-[0.08em] align-baseline">
      <Img
        photo={photo}
        sizes="260px"
        maxWidth={768}
        className={`inline-block h-[0.78em] rounded-full ${className}`}
      />
    </span>
  )
}

export function Closing() {
  const wa = whatsappHref()
  return (
    <section
      aria-labelledby="closing-title"
      className="grain relative overflow-hidden bg-gradient-to-b from-shell via-blush to-petal pb-24 pt-16 text-center md:pb-36 md:pt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[90vw] max-h-[1100px] w-[90vw] max-w-[1100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,255,255,0.7),transparent)]"
      />
      <div className="gutter page relative">
        <Reveal className="flex justify-center">
          <Eyebrow className="mb-8 md:mb-12">Seu momento</Eyebrow>
        </Reveal>
        <Reveal>
          <h2
            id="closing-title"
            className="mx-auto max-w-[15ch] font-serif text-[clamp(2.9rem,8.6vw,8rem)] font-normal leading-[0.98] tracking-[-0.025em] text-ink"
          >
            Reserve um tempo <Pill photo={photos.closing} className="w-[1.7em]" /> que seja{' '}
            <em className="text-wine">só seu</em> <Pill photo={photos.ritual4} className="w-[1.25em]" />
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-[44ch] text-[1.06rem] text-ink/70 md:mt-10">
            Uma hora longe das notificações já muda o resto da semana. Escolha o tratamento e a gente cuida do resto.
          </p>
          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Button onClick={() => requestBooking()}>Solicitar horário</Button>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonBase} ${buttonVariants.ghost.cls}`}
              >
                <ButtonFill variant="ghost" />
                Conversar no WhatsApp
              </a>
            )}
          </div>
          <p className="sr-only">{site.brand}</p>
        </Reveal>
      </div>
    </section>
  )
}
