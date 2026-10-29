import { describe, expect, it } from 'vitest'
import { resolveTheme } from './theme'

describe('resolveTheme', () => {
  it('geeft een bewaarde keuze voorrang op de systeemvoorkeur', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })

  it('volgt de systeemvoorkeur zonder bewaarde keuze', () => {
    expect(resolveTheme(null, true)).toBe('dark')
    expect(resolveTheme(null, false)).toBe('light')
  })

  it('negeert een ongeldige bewaarde waarde', () => {
    expect(resolveTheme('blue', true)).toBe('dark')
    expect(resolveTheme('', false)).toBe('light')
  })
})
