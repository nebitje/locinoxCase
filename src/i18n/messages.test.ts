import { describe, expect, it } from 'vitest'
import { SUPPORTED_LOCALES } from './locales'
import de from './messages/de'
import en from './messages/en'
import fr from './messages/fr'
import nl from './messages/nl'

const messages = { en, fr, de, nl }

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (typeof value !== 'object' || value === null) return [prefix]
  return Object.entries(value).flatMap(([key, child]) =>
    flattenKeys(child, prefix ? `${prefix}.${key}` : key),
  )
}

describe('interfacevertalingen', () => {
  const referenceKeys = flattenKeys(en).sort()

  it.each(SUPPORTED_LOCALES)('%s bevat dezelfde sleutels als het Engels', (locale) => {
    expect(flattenKeys(messages[locale]).sort()).toEqual(referenceKeys)
  })

  it.each(SUPPORTED_LOCALES)('%s bevat geen lege teksten', (locale) => {
    const empty = flattenKeys(messages[locale]).filter((key) => {
      const text = key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown>)[part], messages[locale])
      return typeof text !== 'string' || text.trim() === ''
    })
    expect(empty).toEqual([])
  })
})
