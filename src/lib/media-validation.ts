export const MAX_IMAGE_BYTES = 5 * 1024 * 1024
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024
export const MAX_CAROUSEL_SLIDES = 10

export const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
export const VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime']
export const ACCEPTED_TYPES = [...IMAGE_TYPES, ...VIDEO_TYPES]

export type MediaKind = 'image' | 'video'
export type PostFormat = 'image' | 'video' | 'carousel'

/** Een foutcode die de interface naar een vertaalde melding omzet. */
export type MediaError =
  | 'none'
  | 'type'
  | 'imageTooLarge'
  | 'videoTooLarge'
  | 'mixed'
  | 'multipleVideos'
  | 'tooManySlides'

export interface FileLike {
  name: string
  type: string
  size: number
}

export interface MediaCheck {
  ok: boolean
  format: PostFormat | null
  /** De eerste foutcode, of null als alles klopt. */
  error: MediaError | null
  /** Naam van het bestand dat de fout veroorzaakt, indien van toepassing. */
  fileName?: string
}

export function kindOf(file: Pick<FileLike, 'type'>): MediaKind | null {
  if (IMAGE_TYPES.includes(file.type)) return 'image'
  if (VIDEO_TYPES.includes(file.type)) return 'video'
  return null
}

function fail(error: MediaError, fileName?: string): MediaCheck {
  return { ok: false, format: null, error, fileName }
}

/**
 * Controleert de gekozen bestanden: één afbeelding, één video of 2 tot 10 afbeeldingen (carrousel).
 * Afbeeldingen en video's mengen kan niet.
 */
export function validateMedia(files: FileLike[]): MediaCheck {
  if (files.length === 0) return fail('none')

  for (const file of files) {
    const kind = kindOf(file)
    if (!kind) return fail('type', file.name)
    if (kind === 'image' && file.size > MAX_IMAGE_BYTES) return fail('imageTooLarge', file.name)
    if (kind === 'video' && file.size > MAX_VIDEO_BYTES) return fail('videoTooLarge', file.name)
  }

  const videos = files.filter((file) => kindOf(file) === 'video').length
  if (videos > 0 && videos < files.length) return fail('mixed')
  if (videos > 1) return fail('multipleVideos')
  if (videos === 1) return { ok: true, format: 'video', error: null }

  if (files.length > MAX_CAROUSEL_SLIDES) return fail('tooManySlides')
  return { ok: true, format: files.length === 1 ? 'image' : 'carousel', error: null }
}

export function extensionFor(mimeType: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'video/quicktime': 'mov',
  }
  return map[mimeType] ?? 'bin'
}
