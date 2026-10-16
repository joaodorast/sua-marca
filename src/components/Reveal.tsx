import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { ease } from '../lib/motion'

type Props = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  as?: 'div' | 'li' | 'p' | 'span' | 'figure'
}

/** Revela o conteúdo ao entrar na tela. Com movimento reduzido, aparece direto. */
export function Reveal({ children, className, delay = 0, y = 26, as = 'div' }: Props) {
  const reduce = useReducedMotion()
  const Tag = motion[as]
  if (reduce) return <Tag className={className}>{children}</Tag>
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </Tag>
  )
}
