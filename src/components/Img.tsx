import { useState } from 'react'
import { site, type Photo } from '../config/site'
import { imageUrl, srcSet } from '../lib/image'

type Props = {
  photo: Photo
  sizes: string
  className?: string
  imgClassName?: string
  priority?: boolean
  maxWidth?: number
}

/**
 * Imagem responsiva com srcset, carregamento preguiçoso abaixo da dobra,
 * revelação suave ao carregar e um substituto elegante se a foto falhar.
 * O contêiner (className) define a proporção — evita deslocamento de layout.
 */
export function Img({ photo, sizes, className = '', imgClassName = '', priority, maxWidth }: Props) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading')

  return (
    <span className={`${/\b(absolute|fixed)\b/.test(className) ? '' : 'relative'} block overflow-hidden bg-blush ${className}`}>
      {state !== 'error' && (
        <img
          src={imageUrl(photo.src, 1080)}
          srcSet={srcSet(photo, maxWidth)}
          sizes={sizes}
          alt={photo.alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          {...(priority ? { fetchpriority: 'high' } : {})}
          onLoad={() => setState('ready')}
          onError={() => setState('error')}
          style={{ objectPosition: photo.focus ?? '50% 50%' }}
          className={`absolute inset-0 h-full w-full object-cover photo-tone transition-[opacity,transform] duration-[1400ms] ease-silk ${
            state === 'ready' ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.03]'
          } ${imgClassName}`}
        />
      )}
      {state === 'error' && (
        <span className="absolute inset-0 grid place-items-center p-4 text-center" role="img" aria-label={photo.alt}>
          <span aria-hidden className="font-serif text-base italic leading-snug text-wine/60">{site.brand}</span>
        </span>
      )}
    </span>
  )
}
