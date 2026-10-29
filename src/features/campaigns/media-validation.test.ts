import { describe, expect, it } from 'vitest'
import {
  MAX_CAROUSEL_SLIDES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  extensionFor,
  validateMedia,
  type FileLike,
} from './media-validation'

const image = (name = 'a.jpg', size = 1000): FileLike => ({ name, type: 'image/jpeg', size })
const video = (name = 'a.mp4', size = 1000): FileLike => ({ name, type: 'video/mp4', size })

describe('validateMedia', () => {
  it('weigert een lege selectie', () => {
    expect(validateMedia([])).toMatchObject({ ok: false, error: 'none' })
  })

  it('herkent één afbeelding', () => {
    expect(validateMedia([image()])).toMatchObject({ ok: true, format: 'image' })
  })

  it('herkent één video', () => {
    expect(validateMedia([video()])).toMatchObject({ ok: true, format: 'video' })
  })

  it('herkent een carrousel van meerdere afbeeldingen', () => {
    expect(validateMedia([image('1.jpg'), image('2.jpg')])).toMatchObject({ ok: true, format: 'carousel' })
  })

  it('weigert meer dan het maximum aantal slides', () => {
    const files = Array.from({ length: MAX_CAROUSEL_SLIDES + 1 }, (_, i) => image(`${i}.jpg`))
    expect(validateMedia(files)).toMatchObject({ ok: false, error: 'tooManySlides' })
    expect(validateMedia(files.slice(0, MAX_CAROUSEL_SLIDES)).ok).toBe(true)
  })

  it('weigert afbeeldingen en video samen', () => {
    expect(validateMedia([image(), video()])).toMatchObject({ ok: false, error: 'mixed' })
  })

  it('weigert meerdere video’s', () => {
    expect(validateMedia([video('1.mp4'), video('2.mp4')])).toMatchObject({ ok: false, error: 'multipleVideos' })
  })

  it('weigert een onbekend bestandstype en noemt het bestand', () => {
    const result = validateMedia([{ name: 'doc.pdf', type: 'application/pdf', size: 10 }])
    expect(result).toMatchObject({ ok: false, error: 'type', fileName: 'doc.pdf' })
  })

  it('weigert een te grote afbeelding maar laat de grens zelf toe', () => {
    expect(validateMedia([image('groot.jpg', MAX_IMAGE_BYTES + 1)])).toMatchObject({
      ok: false,
      error: 'imageTooLarge',
      fileName: 'groot.jpg',
    })
    expect(validateMedia([image('grens.jpg', MAX_IMAGE_BYTES)]).ok).toBe(true)
  })

  it('weigert een te grote video maar laat de grens zelf toe', () => {
    expect(validateMedia([video('groot.mp4', MAX_VIDEO_BYTES + 1)])).toMatchObject({
      ok: false,
      error: 'videoTooLarge',
    })
    expect(validateMedia([video('grens.mp4', MAX_VIDEO_BYTES)]).ok).toBe(true)
  })
})

describe('extensionFor', () => {
  it('geeft de juiste extensie per type', () => {
    expect(extensionFor('image/png')).toBe('png')
    expect(extensionFor('video/quicktime')).toBe('mov')
    expect(extensionFor('text/plain')).toBe('bin')
  })
})
