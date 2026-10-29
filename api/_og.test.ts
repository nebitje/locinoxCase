import { describe, expect, it } from 'vitest'
import { buildOgHtml, escapeHtml, isUuid } from './_og.js'

const PAGE = 'https://app.example.com/p/1'
const APP = 'https://app.example.com/posts/1'

describe('buildOgHtml', () => {
  it('zet titel, beschrijving en afbeelding in Open Graph-tags', () => {
    const html = buildOgHtml({ title: 'Nieuw slot', copy: 'Veilig en slim.', imageUrl: 'https://cdn.example.com/a.jpg' }, PAGE, APP)
    expect(html).toContain('<meta property="og:title" content="Nieuw slot">')
    expect(html).toContain('<meta property="og:description" content="Veilig en slim.">')
    expect(html).toContain('<meta property="og:image" content="https://cdn.example.com/a.jpg">')
    expect(html).toContain('summary_large_image')
  })

  it('laat de afbeelding weg bij een video', () => {
    const html = buildOgHtml({ title: 'Video', copy: 'x', imageUrl: null }, PAGE, APP)
    expect(html).not.toContain('og:image')
    expect(html).toContain('name="twitter:card" content="summary"')
  })

  it('escapet HTML in de titel en tekst', () => {
    const html = buildOgHtml({ title: '<script>alert(1)</script>', copy: '"quote" & <b>', imageUrl: null }, PAGE, APP)
    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
    expect(html).toContain('&quot;quote&quot; &amp; &lt;b&gt;')
  })

  it('kort lange beschrijvingen in', () => {
    const html = buildOgHtml({ title: 't', copy: 'a'.repeat(500), imageUrl: null }, PAGE, APP)
    const match = /og:description" content="([^"]*)"/.exec(html)
    expect(match?.[1]?.length).toBeLessThanOrEqual(200)
  })

  it('stuurt bezoekers door naar de app', () => {
    expect(buildOgHtml({ title: 't', copy: 'c', imageUrl: null }, PAGE, APP)).toContain(`url=${APP}`)
  })
})

describe('isUuid', () => {
  it('accepteert enkel geldige UUID’s', () => {
    expect(isUuid('3f2b8c1e-5a4d-4e9b-9c1a-7d6e5f4a3b2c')).toBe(true)
    expect(isUuid('abc')).toBe(false)
    expect(isUuid('1; drop table campaigns')).toBe(false)
    expect(isUuid(null)).toBe(false)
  })
})

describe('escapeHtml', () => {
  it('escapet de gevaarlijke tekens', () => {
    expect(escapeHtml(`<>&"'`)).toBe('&lt;&gt;&amp;&quot;&#39;')
  })
})
