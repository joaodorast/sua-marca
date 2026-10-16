import { site } from '../config/site'

export function whatsappHref(text?: string) {
  const n = site.contact.whatsapp.replace(/\D/g, '')
  if (!n) return ''
  const msg = text ?? `Olá, ${site.brand}! Gostaria de saber mais sobre os tratamentos.`
  return `https://wa.me/${n}?text=${encodeURIComponent(msg)}`
}
