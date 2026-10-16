/** Rolagem suave até uma âncora, compensando o cabeçalho fixo. */
export function scrollToId(id: string) {
  const el = document.getElementById(id.replace('#', ''))
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const top = el.getBoundingClientRect().top + window.scrollY - 72
  window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

/** Evento global para pré-selecionar um tratamento no formulário. */
export const SELECT_TREATMENT = 'select-treatment'
export function requestBooking(treatmentId?: string) {
  if (treatmentId) window.dispatchEvent(new CustomEvent(SELECT_TREATMENT, { detail: treatmentId }))
  scrollToId('agendar')
}
