import type { Photo } from '../config/site'

const WIDTHS = [480, 768, 1080, 1440, 1920]

/** Aceita um ID do Unsplash ("photo-…") ou qualquer URL/caminho próprio. */
export function isUnsplash(src: string) {
  return src.startsWith('photo-')
}

export function imageUrl(src: string, width: number, height?: number) {
  if (!isUnsplash(src)) return src
  const h = height ? `&h=${height}` : ''
  return `https://images.unsplash.com/${src}?auto=format&fit=crop&w=${width}${h}&q=78`
}

export function srcSet(photo: Photo, maxWidth = 1920) {
  if (!isUnsplash(photo.src)) return undefined
  return WIDTHS.filter((w) => w <= maxWidth)
    .map((w) => `${imageUrl(photo.src, w)} ${w}w`)
    .join(', ')
}
