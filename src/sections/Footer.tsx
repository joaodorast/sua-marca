import { ArrowUp } from 'lucide-react'
import { nav, site } from '../config/site'
import { requestBooking, scrollToId } from '../lib/scroll'
import { whatsappHref } from '../lib/contact'
import { Wordmark } from './Header'
import { Button } from '../components/Button'

function ColTitle({ children }: { children: string }) {
  return <p className="eyebrow mb-5 text-petal">{children}</p>
}

export function Footer() {
  const c = site.contact
  const wa = whatsappHref()
  const hasContact = Boolean(c.phoneDisplay || c.email || c.address || wa)
  const year = new Date().getFullYear()

  return (
    <footer
      id="contato"
      className="relative overflow-hidden bg-plum pb-28 pt-20 text-blush/80 md:pb-10 md:pt-28"
      aria-labelledby="footer-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[20%] -top-[40%] h-[70vw] max-h-[900px] w-[70vw] max-w-[900px] rounded-full bg-[radial-gradient(closest-side,rgba(199,127,145,0.22),transparent)]"
      />
      <div className="gutter page relative">
        <h2 id="footer-title" className="sr-only">
          Contato
        </h2>

        {/* Chamada */}
        <div className="flex flex-col gap-8 border-b border-shell/10 pb-14 md:flex-row md:items-end md:justify-between md:pb-20">
          <p className="max-w-[16ch] font-serif text-[clamp(2.3rem,4.6vw,4rem)] leading-[1.02] text-shell">
            Cuidado com tempo, técnica e <em className="text-petal">delicadeza.</em>
          </p>
          <Button variant="light" className="self-start md:self-auto" onClick={() => requestBooking()}>
            Solicitar horário
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-12 pt-14 md:grid-cols-12 md:pt-16">
          <div className="md:col-span-3">
            <ColTitle>Navegar</ColTitle>
            <ul className="space-y-3" role="list">
              {nav.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToId(n.href === '#contato' ? '#agendar' : n.href)
                    }}
                    className="link-underline inline-block py-0.5 text-shell/85 transition-colors hover:text-shell"
                  >
                    {n.href === '#contato' ? 'Agendar' : n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <ColTitle>Atendimento</ColTitle>
            {hasContact ? (
              <ul className="space-y-3 break-words" role="list">
                {wa && (
                  <li>
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="link-underline text-shell/85 hover:text-shell">
                      WhatsApp
                    </a>
                  </li>
                )}
                {c.phoneDisplay && (
                  <li>
                    <a href={`tel:${c.phoneDisplay.replace(/[^\d+]/g, '')}`} className="link-underline text-shell/85 hover:text-shell">
                      {c.phoneDisplay}
                    </a>
                  </li>
                )}
                {c.email && (
                  <li>
                    <a href={`mailto:${c.email}`} className="link-underline text-shell/85 hover:text-shell">
                      {c.email}
                    </a>
                  </li>
                )}
                {c.address && (
                  <li>
                    {c.mapsUrl ? (
                      <a href={c.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-underline text-shell/85 hover:text-shell">
                        {c.address}
                      </a>
                    ) : (
                      c.address
                    )}
                  </li>
                )}
              </ul>
            ) : (
              <p className="max-w-[30ch]">
                Envie seu pedido pelo formulário de agendamento e a equipe responde para confirmar o horário.
              </p>
            )}
          </div>

          {(c.hours.length > 0 || site.social.length > 0) && (
            <div className="col-span-2 grid grid-cols-2 gap-8 md:col-span-5">
              {c.hours.length > 0 && (
                <div>
                  <ColTitle>Horários</ColTitle>
                  <ul className="space-y-2" role="list">
                    {c.hours.map((h) => (
                      <li key={h.days}>
                        <span className="text-shell">{h.days}</span> · {h.time}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {site.social.length > 0 && (
                <div>
                  <ColTitle>Redes</ColTitle>
                  <ul className="space-y-3" role="list">
                    {site.social.map((s) => (
                      <li key={s.url}>
                        <a href={s.url} target="_blank" rel="noopener noreferrer" className="link-underline text-shell/85 hover:text-shell">
                          {s.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Assinatura */}
        <div aria-hidden className="mt-16 select-none overflow-hidden md:mt-24">
          <Wordmark className="block whitespace-nowrap text-[clamp(4.4rem,21.5vw,21.5rem)] leading-[0.85] text-shell/95" />
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-shell/10 pt-6 text-[0.82rem] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {site.brand}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <p>
              Fotografias:{' '}
              <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="link-underline text-shell/85">
                Unsplash
              </a>
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="grid h-11 w-11 place-items-center rounded-full border border-shell/20 text-shell transition-colors hover:bg-shell hover:text-plum"
              aria-label="Voltar ao topo"
            >
              <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
