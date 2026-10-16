import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'

type Variant = 'solid' | 'dark' | 'ghost' | 'light' | 'outline-light'

/** Classes compartilhadas por botões e links com aparência de botão. */
export const buttonBase =
  'group relative isolate inline-flex min-h-[52px] items-center justify-center gap-3 overflow-hidden rounded-full px-7 text-[0.78rem] font-semibold uppercase tracking-[0.16em] transition-[color,border-color,transform] duration-500 ease-silk active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60'

/* Cada variante tem uma "maré" de cor que sobe por trás do texto no hover. */
export const buttonVariants: Record<Variant, { cls: string; fill: string }> = {
  solid: { cls: 'bg-wine text-paper', fill: 'bg-ink' },
  dark: { cls: 'bg-ink text-paper', fill: 'bg-wine' },
  ghost: { cls: 'border border-wine/25 text-wine hover:border-wine hover:text-paper', fill: 'bg-wine' },
  light: { cls: 'bg-paper text-ink', fill: 'bg-blush' },
  'outline-light': { cls: 'border border-paper/45 text-paper hover:border-paper hover:text-ink', fill: 'bg-paper' },
}

export function ButtonFill({ variant }: { variant: Variant }) {
  return (
    <span
      aria-hidden
      className={`absolute inset-0 -z-10 translate-y-[101%] rounded-full transition-transform duration-500 ease-silk group-hover:translate-y-0 group-disabled:translate-y-[101%] ${buttonVariants[variant].fill}`}
    />
  )
}

export function ButtonArrow() {
  return (
    <span
      aria-hidden
      className="relative -mr-2 grid h-8 w-8 place-items-center overflow-hidden rounded-full"
    >
      <ArrowUpRight
        className="h-4 w-4 transition-transform duration-500 ease-silk group-hover:-translate-y-6 group-hover:translate-x-6"
        strokeWidth={1.6}
      />
      <ArrowUpRight
        className="absolute h-4 w-4 -translate-x-6 translate-y-6 transition-transform duration-500 ease-silk group-hover:translate-x-0 group-hover:translate-y-0"
        strokeWidth={1.6}
      />
    </span>
  )
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
  arrow?: boolean
}

export function Button({ variant = 'solid', className = '', children, arrow = true, ...rest }: Props) {
  return (
    <button className={`${buttonBase} ${buttonVariants[variant].cls} ${className}`} {...rest}>
      <ButtonFill variant={variant} />
      <span>{children}</span>
      {arrow && <ButtonArrow />}
    </button>
  )
}

/** Rótulo editorial em caixa alta, com um traço de rosa queimado. */
export function Eyebrow({
  children,
  className = '',
  tone = 'rose',
}: {
  children: ReactNode
  className?: string
  tone?: 'rose' | 'light'
}) {
  return (
    <p
      className={`eyebrow flex items-center gap-3 ${tone === 'light' ? 'text-petal' : 'text-roseink'} ${className}`}
    >
      <span aria-hidden className={`h-px w-8 ${tone === 'light' ? 'bg-petal/70' : 'bg-burnt'}`} />
      {children}
    </p>
  )
}
