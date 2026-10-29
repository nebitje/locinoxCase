import { describe, expect, it } from 'vitest'
import {
  choosePrimaryMethod,
  fileNameFor,
  linkedInShareUrl,
  publicPostUrl,
  resolvePublicOrigin,
} from './share'

describe('choosePrimaryMethod', () => {
  it('kiest het deelvenster van het toestel op mobiel met bestandsondersteuning', () => {
    expect(choosePrimaryMethod({ canShareFiles: true, isMobile: true })).toBe('native')
  })

  it('valt op mobiel zonder bestandsondersteuning terug op LinkedIn', () => {
    expect(choosePrimaryMethod({ canShareFiles: false, isMobile: true })).toBe('linkedin')
  })

  it('kiest op desktop altijd LinkedIn', () => {
    expect(choosePrimaryMethod({ canShareFiles: true, isMobile: false })).toBe('linkedin')
    expect(choosePrimaryMethod({ canShareFiles: false, isMobile: false })).toBe('linkedin')
  })
})

describe('resolvePublicOrigin', () => {
  const current = 'https://locinox-case-abc123-team.vercel.app'

  it('gebruikt het ingestelde publieke adres, zonder pad', () => {
    expect(resolvePublicOrigin('https://locinox-case.vercel.app/', current)).toBe('https://locinox-case.vercel.app')
    expect(resolvePublicOrigin(' https://locinox-case.vercel.app/posts ', current)).toBe('https://locinox-case.vercel.app')
  })

  it('valt terug op het huidige adres zonder of met ongeldige instelling', () => {
    expect(resolvePublicOrigin(undefined, current)).toBe(current)
    expect(resolvePublicOrigin('', current)).toBe(current)
    expect(resolvePublicOrigin('geen url', current)).toBe(current)
    expect(resolvePublicOrigin('javascript:alert(1)', current)).toBe(current)
  })
})

describe('URL-opbouw', () => {
  it('bouwt de publieke postlink', () => {
    expect(publicPostUrl('https://app.example.com', 'abc')).toBe('https://app.example.com/p/abc')
  })

  it('voegt de taal toe aan de publieke postlink', () => {
    expect(publicPostUrl('https://app.example.com', 'abc', 'fr')).toBe('https://app.example.com/p/abc?lang=fr')
  })

  it('codeert de link in de LinkedIn-share-URL', () => {
    const url = linkedInShareUrl('https://app.example.com/p/abc?x=1&y=2')
    expect(url).toBe(
      'https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fapp.example.com%2Fp%2Fabc%3Fx%3D1%26y%3D2',
    )
  })
})

describe('fileNameFor', () => {
  it('maakt een veilige bestandsnaam uit de titel', () => {
    expect(fileNameFor('Ons nieuwe slot: Pro!', 0, 'image/jpeg', 1)).toBe('ons-nieuwe-slot-pro.jpeg')
  })

  it('nummert de slides van een carrousel', () => {
    expect(fileNameFor('Slot', 1, 'image/png', 3)).toBe('slot-2.png')
  })

  it('valt terug op een standaardnaam en zet quicktime om naar mov', () => {
    expect(fileNameFor('???', 0, 'video/quicktime', 1)).toBe('post.mov')
  })
})
