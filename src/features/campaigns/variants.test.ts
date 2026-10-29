import { describe, expect, it } from 'vitest'
import {
  MAX_COPY_LENGTH,
  MAX_VARIANTS_PER_LANGUAGE,
  availableLanguages,
  emptyCopyInput,
  pickVariants,
  toVariants,
  validateVariants,
  type Variant,
} from './variants'

function filled(overrides: Partial<ReturnType<typeof emptyCopyInput>> = {}) {
  return { ...emptyCopyInput(), en: ['Hello'], fr: ['Bonjour'], de: ['Hallo'], ...overrides }
}

describe('toVariants', () => {
  it('trimt, slaat lege teksten over en nummert per taal vanaf 1', () => {
    const variants = toVariants(filled({ en: ['  One ', '', 'Two'], nl: ['Hoi'] }))
    expect(variants.filter((v) => v.language === 'en')).toEqual([
      { language: 'en', variantNo: 1, copy: 'One' },
      { language: 'en', variantNo: 2, copy: 'Two' },
    ])
    expect(variants.find((v) => v.language === 'nl')).toEqual({ language: 'nl', variantNo: 1, copy: 'Hoi' })
  })
})

describe('validateVariants', () => {
  it('accepteert EN, FR en DE zonder Nederlands', () => {
    expect(validateVariants(filled())).toBeNull()
  })

  it('meldt welke verplichte talen ontbreken, ook bij enkel witruimte', () => {
    expect(validateVariants(filled({ fr: ['   '], de: [''] }))).toEqual({
      code: 'missingLanguages',
      languages: ['fr', 'de'],
    })
  })

  it('weigert te veel varianten in één taal', () => {
    const many = Array.from({ length: MAX_VARIANTS_PER_LANGUAGE + 1 }, (_, i) => `Tekst ${i}`)
    expect(validateVariants(filled({ en: many }))).toEqual({ code: 'tooMany' })
    expect(validateVariants(filled({ en: many.slice(0, MAX_VARIANTS_PER_LANGUAGE) }))).toBeNull()
  })

  it('weigert een te lange tekst maar laat de grens toe', () => {
    expect(validateVariants(filled({ en: ['a'.repeat(MAX_COPY_LENGTH + 1)] }))).toEqual({ code: 'tooLong' })
    expect(validateVariants(filled({ en: ['a'.repeat(MAX_COPY_LENGTH)] }))).toBeNull()
  })
})

const stored: Variant[] = [
  { language: 'en', variantNo: 2, copy: 'EN two' },
  { language: 'en', variantNo: 1, copy: 'EN one' },
  { language: 'fr', variantNo: 1, copy: 'FR un' },
  { language: 'de', variantNo: 1, copy: 'DE eins' },
]

describe('availableLanguages', () => {
  it('geeft de talen met tekst in vaste volgorde', () => {
    expect(availableLanguages(stored)).toEqual(['en', 'fr', 'de'])
  })
})

describe('pickVariants', () => {
  it('geeft de varianten van de gevraagde taal op volgorde van nummer', () => {
    const result = pickVariants(stored, 'en')
    expect(result.fellBack).toBe(false)
    expect(result.variants.map((v) => v.copy)).toEqual(['EN one', 'EN two'])
  })

  it('valt terug op het Engels als de taal ontbreekt', () => {
    const result = pickVariants(stored, 'nl')
    expect(result).toMatchObject({ language: 'en', fellBack: true })
    expect(result.variants[0]?.copy).toBe('EN one')
  })

  it('valt terug op de eerste beschikbare taal als ook het Engels ontbreekt', () => {
    const result = pickVariants(stored.filter((v) => v.language !== 'en'), 'nl')
    expect(result).toMatchObject({ language: 'fr', fellBack: true })
  })

  it('geeft een lege lijst zonder varianten', () => {
    expect(pickVariants([], 'fr').variants).toEqual([])
  })
})
