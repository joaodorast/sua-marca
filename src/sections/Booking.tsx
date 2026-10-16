import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { AlertCircle, Check, Loader2, MessageCircle } from 'lucide-react'
import { photos, site, treatments } from '../config/site'
import { Reveal } from '../components/Reveal'
import { Button, Eyebrow } from '../components/Button'
import { Img } from '../components/Img'
import {
  bookingChannel,
  formatPhone,
  sendToEndpoint,
  todayISO,
  validate,
  whatsappUrl,
  type BookingData,
} from '../lib/booking'
import { SELECT_TREATMENT } from '../lib/scroll'
import { ease } from '../lib/motion'

type Status = 'idle' | 'sending' | 'sent' | 'whatsapp' | 'error' | 'unconfigured'

const empty: BookingData = { name: '', phone: '', treatmentId: '', period: '', date: '', notes: '' }

const steps = [
  { title: 'Você envia o pedido', text: 'Com o tratamento e o período que preferir.' },
  { title: 'Nós conferimos a agenda', text: 'E respondemos com os horários disponíveis.' },
  { title: 'O horário é confirmado', text: 'Só então a sua sessão fica reservada.' },
]

function FieldError({ id, msg }: { id: string; msg?: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          id={id}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-2 flex items-center gap-1.5 text-[0.85rem] text-wine"
        >
          <AlertCircle aria-hidden className="h-3.5 w-3.5 shrink-0" strokeWidth={1.8} />
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

export function Booking() {
  const uid = useId()
  const [data, setData] = useState<BookingData>(empty)
  const [errors, setErrors] = useState<Partial<Record<keyof BookingData, string>>>({})
  const [touched, setTouched] = useState(false)
  const [status, setStatus] = useState<Status>('idle')
  const [waLink, setWaLink] = useState('')
  const formRef = useRef<HTMLFormElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const channel = bookingChannel()

  // Pré-seleção vinda de outros botões do site
  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail
      setData((d) => ({ ...d, treatmentId: id }))
      setErrors((er) => ({ ...er, treatmentId: undefined }))
    }
    window.addEventListener(SELECT_TREATMENT, onSelect)
    return () => window.removeEventListener(SELECT_TREATMENT, onSelect)
  }, [])

  const set = <K extends keyof BookingData>(key: K, value: BookingData[K]) => {
    const next = { ...data, [key]: value }
    setData(next)
    if (touched) setErrors(validate(next))
    if (status === 'error' || status === 'unconfigured') setStatus('idle')
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched(true)
    const errs = validate(data)
    setErrors(errs)
    const first = Object.keys(errs)[0]
    if (first) {
      const el = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)
      el?.focus()
      return
    }

    if (channel === 'none') {
      setStatus('unconfigured')
      requestAnimationFrame(() => statusRef.current?.focus())
      return
    }

    if (channel === 'whatsapp') {
      const url = whatsappUrl(data)
      setWaLink(url)
      window.open(url, '_blank', 'noopener,noreferrer')
      setStatus('whatsapp')
      requestAnimationFrame(() => statusRef.current?.focus())
      return
    }

    setStatus('sending')
    try {
      await sendToEndpoint(data)
      setStatus('sent')
    } catch {
      setStatus('error')
    }
    requestAnimationFrame(() => statusRef.current?.focus())
  }

  const reset = () => {
    setData(empty)
    setErrors({})
    setTouched(false)
    setStatus('idle')
  }

  const done = status === 'sent' || status === 'whatsapp'
  const options = [...treatments.map((t) => ({ id: t.id, label: t.name })), { id: 'indefinido', label: 'Ainda não sei' }]

  return (
    <section id="agendar" aria-labelledby="agendar-title" className="relative bg-shell py-20 md:py-32">
      <div className="gutter page">
        <div className="grid overflow-hidden rounded-[36px] shadow-[0_60px_120px_-70px_rgba(59,35,41,0.55)] lg:grid-cols-12">
          {/* Introdução */}
          <div className="relative isolate overflow-hidden bg-wine px-6 py-12 text-shell sm:px-10 md:py-16 lg:col-span-5 lg:px-12 lg:py-16 xl:px-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-1/3 -top-1/4 -z-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgba(239,195,205,0.28),transparent)]"
            />
            <Reveal>
              <Eyebrow tone="light" className="mb-6">
                Agendamento
              </Eyebrow>
              <h2 id="agendar-title" className="font-serif text-[clamp(2.5rem,4vw,3.8rem)] leading-[1.02] tracking-[-0.015em]">
                Escolha um momento. <em className="text-petal">Nós preparamos o resto.</em>
              </h2>
              <p className="mt-6 max-w-[38ch] text-blush/80">
                Envie sua preferência de tratamento e horário. A equipe responde para confirmar a disponibilidade.
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <ol className="mt-10 border-t border-shell/15" aria-label="Como funciona">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-5 border-b border-shell/15 py-5">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-shell/10 font-serif text-lg italic text-petal">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block font-medium text-shell">{s.title}</span>
                      <span className="block text-[0.95rem] text-blush/70">{s.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>

            {site.booking.externalSchedulerUrl && (
              <a
                href={site.booking.externalSchedulerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline mt-8 inline-block text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-petal"
              >
                Prefere escolher direto na agenda on-line?
              </a>
            )}

            <div className="mt-10 hidden items-end gap-4 lg:flex">
              <Img photo={photos.heroDetail} sizes="120px" maxWidth={480} className="arch h-36 w-28 shrink-0" />
              <p className="pb-2 font-serif text-[1.3rem] italic leading-snug text-blush/90">
                Seu horário, sem pressa e sem sobreposição.
              </p>
            </div>
          </div>

        {/* Formulário */}
        <div className="bg-paper lg:col-span-7">
          <div className="p-6 py-10 sm:p-10 lg:p-14 xl:p-16">
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div
                  key="done"
                  ref={statusRef}
                  tabIndex={-1}
                  role="status"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease }}
                  className="py-8 text-center sm:py-14"
                >
                  <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-blush text-wine ring-8 ring-shell">
                    {status === 'sent' ? (
                      <Check className="h-7 w-7" strokeWidth={1.4} />
                    ) : (
                      <MessageCircle className="h-7 w-7" strokeWidth={1.4} />
                    )}
                  </span>
                  <h3 className="mt-8 font-serif text-[2.6rem] leading-tight">
                    {status === 'sent' ? 'Pedido recebido' : 'Falta só um toque'}
                  </h3>
                  <p className="mx-auto mt-4 max-w-[34ch] text-stone">
                    {status === 'sent'
                      ? `Recebemos, ${data.name.trim().split(' ')[0]}. A equipe vai responder pelo seu celular para confirmar o horário. Até lá, o horário ainda não está reservado.`
                      : 'Abrimos o WhatsApp com a sua mensagem pronta. Envie por lá para que a equipe confirme o horário.'}
                  </p>
                  <div className="mt-10 flex flex-col items-center gap-3">
                    {status === 'whatsapp' && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[52px] items-center gap-3 rounded-full bg-wine px-7 text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-paper transition-colors hover:bg-ink"
                      >
                        <MessageCircle aria-hidden className="h-4 w-4" strokeWidth={1.6} />
                        Abrir o WhatsApp de novo
                      </a>
                    )}
                    <button
                      onClick={reset}
                      className="link-underline min-h-[44px] text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-stone"
                    >
                      Fazer outro pedido
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  ref={formRef}
                  noValidate
                  onSubmit={onSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-8"
                  aria-describedby={`${uid}-hint`}
                >
                  <div className="flex items-end justify-between gap-4 border-b border-wine/10 pb-6">
                    <h3 className="font-serif text-[2rem] leading-none text-ink">Seu pedido</h3>
                    <p id={`${uid}-hint`} className="text-[0.8rem] text-stone">
                      * campos obrigatórios
                    </p>
                  </div>

                  {/* Tratamento */}
                  <fieldset>
                    <legend className="field-label mb-4">Tratamento *</legend>
                    <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-describedby={`${uid}-t-err`}>
                      {options.map((o, i) => {
                        const on = data.treatmentId === o.id
                        return (
                          <label key={o.id} className={`chip ${on ? 'chip-on' : ''} focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-wine`}>
                            <input
                              type="radio"
                              name="treatment"
                              value={o.id}
                              checked={on}
                              onChange={() => set('treatmentId', o.id)}
                              className="sr-only"
                              {...(i === 0 ? { 'data-field': 'treatmentId' } : {})}
                            />
                            {o.label}
                          </label>
                        )
                      })}
                    </div>
                    <FieldError id={`${uid}-t-err`} msg={errors.treatmentId} />
                  </fieldset>

                  {/* Nome e celular */}
                  <div className="grid gap-6 sm:grid-cols-2 sm:gap-5">
                    <div>
                      <label htmlFor="booking-name" className="field-label">
                        Nome *
                      </label>
                      <input
                        id="booking-name"
                        data-field="name"
                        className="field"
                        autoComplete="name"
                        placeholder="Como podemos chamar você"
                        value={data.name}
                        onChange={(e) => set('name', e.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={`${uid}-n-err`}
                      />
                      <FieldError id={`${uid}-n-err`} msg={errors.name} />
                    </div>
                    <div>
                      <label htmlFor="booking-phone" className="field-label">
                        Celular / WhatsApp *
                      </label>
                      <input
                        id="booking-phone"
                        data-field="phone"
                        className="field tabular-nums"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel-national"
                        placeholder="(00) 00000-0000"
                        value={data.phone}
                        onChange={(e) => set('phone', formatPhone(e.target.value))}
                        aria-invalid={Boolean(errors.phone)}
                        aria-describedby={`${uid}-p-err`}
                      />
                      <FieldError id={`${uid}-p-err`} msg={errors.phone} />
                    </div>
                  </div>

                  {/* Data e período */}
                  <div className="grid gap-6 sm:grid-cols-2 sm:gap-5">
                    <div>
                      <label htmlFor="booking-date" className="field-label">
                        Data preferida
                      </label>
                      <input
                        id="booking-date"
                        data-field="date"
                        type="date"
                        min={todayISO()}
                        className="field"
                        value={data.date}
                        onChange={(e) => set('date', e.target.value)}
                        aria-invalid={Boolean(errors.date)}
                        aria-describedby={`${uid}-d-err`}
                      />
                      <FieldError id={`${uid}-d-err`} msg={errors.date} />
                    </div>
                    <fieldset>
                      <legend className="field-label">Período *</legend>
                      <div className="flex flex-wrap gap-2" aria-describedby={`${uid}-pe-err`}>
                        {site.booking.periods.map((p, i) => {
                          const on = data.period === p
                          return (
                            <label key={p} className={`chip flex-1 justify-center px-3 ${on ? 'chip-on' : ''} focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-wine`}>
                              <input
                                type="radio"
                                name="period"
                                value={p}
                                checked={on}
                                onChange={() => set('period', p)}
                                className="sr-only"
                                {...(i === 0 ? { 'data-field': 'period' } : {})}
                              />
                              {p}
                            </label>
                          )
                        })}
                      </div>
                      <FieldError id={`${uid}-pe-err`} msg={errors.period} />
                    </fieldset>
                  </div>

                  <div>
                    <label htmlFor="booking-notes" className="field-label">
                      Algo que devemos saber?
                    </label>
                    <textarea
                      id="booking-notes"
                      rows={3}
                      className="field resize-none"
                      placeholder="Opcional: sensibilidades, preferências, ocasião especial"
                      value={data.notes}
                      onChange={(e) => set('notes', e.target.value.slice(0, 500))}
                    />
                  </div>

                  {/* Erros de envio */}
                  <div ref={statusRef} tabIndex={-1} aria-live="assertive">
                    {status === 'error' && (
                      <p className="flex items-start gap-2 rounded-2xl bg-blush px-4 py-3 text-[0.92rem] text-wine">
                        <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
                        Não conseguimos enviar agora. Verifique a conexão e tente de novo
                        {site.contact.phoneDisplay ? `, ou ligue para ${site.contact.phoneDisplay}` : ''}.
                      </p>
                    )}
                    {status === 'unconfigured' && (
                      <div className="flex flex-col gap-4">
                        <p className="flex items-start gap-2 rounded-2xl bg-blush px-4 py-3 text-[0.92rem] text-wine">
                          <AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.8} />
                          O agendamento on-line ainda não está disponível. Seu pedido não foi enviado.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[0.82rem] leading-relaxed text-stone sm:max-w-[26ch]">
                      Usamos seus dados apenas para responder a este pedido.
                    </p>
                    <Button type="submit" disabled={status === 'sending'} arrow={status !== 'sending'} className="w-full sm:w-auto">
                      {status === 'sending' ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> Enviando
                        </span>
                      ) : channel === 'whatsapp' ? (
                        'Enviar pelo WhatsApp'
                      ) : (
                        'Enviar pedido'
                      )}
                    </Button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
        </div>
      </div>
    </section>
  )
}
