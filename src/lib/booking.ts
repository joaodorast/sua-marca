import { site, treatments } from '../config/site'

export type BookingData = {
  name: string
  phone: string
  treatmentId: string
  period: string
  date: string
  notes: string
}

export type Channel = 'endpoint' | 'whatsapp' | 'none'

export function bookingChannel(): Channel {
  if (site.booking.endpoint) return 'endpoint'
  if (site.contact.whatsapp) return 'whatsapp'
  return 'none'
}

export const onlyDigits = (v: string) => v.replace(/\D/g, '')

/** Máscara brasileira: (21) 99999-9999 */
export function formatPhone(v: string) {
  const d = onlyDigits(v).slice(0, 11)
  if (d.length <= 2) return d.length ? `(${d}` : ''
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

export function todayISO() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

export function validate(data: BookingData) {
  const errors: Partial<Record<keyof BookingData, string>> = {}
  if (data.name.trim().length < 2) errors.name = 'Diga como podemos chamar você.'
  const digits = onlyDigits(data.phone)
  if (digits.length < 10 || digits.length > 11) errors.phone = 'Informe um celular com DDD, por exemplo (21) 99999-9999.'
  if (!data.treatmentId) errors.treatmentId = 'Escolha um tratamento, ou "Ainda não sei".'
  if (!data.period) errors.period = 'Escolha o período que funciona melhor.'
  if (data.date && data.date < todayISO()) errors.date = 'Escolha uma data a partir de hoje.'
  return errors
}

function formatDate(iso: string) {
  if (!iso) return 'Sem preferência'
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export function treatmentName(id: string) {
  if (id === 'indefinido') return 'Ainda não sei, quero orientação'
  return treatments.find((t) => t.id === id)?.name ?? id
}

export function whatsappMessage(data: BookingData) {
  return [
    `Olá, ${site.brand}! Gostaria de solicitar um horário.`,
    '',
    `Nome: ${data.name.trim()}`,
    `Tratamento: ${treatmentName(data.treatmentId)}`,
    `Data preferida: ${formatDate(data.date)}`,
    `Período: ${data.period}`,
    data.notes.trim() ? `Observações: ${data.notes.trim()}` : '',
  ]
    .filter((l, i, a) => !(l === '' && a[i - 1] === ''))
    .join('\n')
    .trim()
}

export function whatsappUrl(data: BookingData) {
  return `https://wa.me/${onlyDigits(site.contact.whatsapp)}?text=${encodeURIComponent(whatsappMessage(data))}`
}

/** Envia para o endpoint configurado. Lança erro se a resposta não for 2xx. */
export async function sendToEndpoint(data: BookingData) {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 15000)
  try {
    const res = await fetch(site.booking.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        nome: data.name.trim(),
        telefone: onlyDigits(data.phone),
        tratamento: treatmentName(data.treatmentId),
        tratamento_id: data.treatmentId,
        data_preferida: data.date || null,
        periodo: data.period,
        observacoes: data.notes.trim() || null,
        origem: typeof window !== 'undefined' ? window.location.href : '',
        enviado_em: new Date().toISOString(),
      }),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
  } finally {
    window.clearTimeout(timer)
  }
}
