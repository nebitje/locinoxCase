export interface OgPost {
  title: string
  copy: string
  /** Absolute URL van de eerste afbeelding; leeg bij een video of zonder media. */
  imageUrl: string | null
}

export const LANGUAGES = ['en', 'fr', 'de', 'nl'] as const
export type OgLanguage = (typeof LANGUAGES)[number]

export function parseLanguage(value: string | null): OgLanguage {
  return LANGUAGES.find((language) => language === value) ?? 'en'
}

export interface OgVariant {
  language: string
  variant_no: number
  copy: string
}

/** Eerste variant in de gevraagde taal; anders het Engels; anders de eerste beschikbare tekst. */
export function pickOgCopy(variants: OgVariant[], language: OgLanguage): string {
  const sorted = [...variants].sort((a, b) => a.variant_no - b.variant_no)
  const found = sorted.find((v) => v.language === language) ?? sorted.find((v) => v.language === 'en') ?? sorted[0]
  return found?.copy ?? ''
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function isUuid(value: string | null): value is string {
  return value !== null && UUID.test(value)
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function truncate(value: string, max: number): string {
  const flat = value.replace(/\s+/g, ' ').trim()
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat
}

/**
 * Publieke pagina met Open Graph-tags: LinkedIn leest hieruit de titel, beschrijving en afbeelding voor de preview.
 * Mensen worden doorgestuurd naar de app (die vraagt zo nodig eerst om in te loggen).
 */
export function buildOgHtml(post: OgPost, pageUrl: string, appUrl: string, language: OgLanguage = 'en'): string {
  const title = escapeHtml(truncate(post.title, 100))
  const description = escapeHtml(truncate(post.copy, 200))
  const page = escapeHtml(pageUrl)
  const app = escapeHtml(appUrl)
  const image = post.imageUrl ? escapeHtml(post.imageUrl) : null

  return `<!doctype html>
<html lang="${language}">
<head>
<meta charset="utf-8">
<title>${title}</title>
<meta name="description" content="${description}">
<meta property="og:type" content="article">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${page}">
${image ? `<meta property="og:image" content="${image}">\n<meta name="twitter:card" content="summary_large_image">\n<meta name="twitter:image" content="${image}">` : '<meta name="twitter:card" content="summary">'}
<meta http-equiv="refresh" content="0;url=${app}">
</head>
<body>
<p><a href="${app}">${title}</a></p>
</body>
</html>
`
}

export function notFoundHtml(): string {
  return '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Not found</title></head><body><p>Post not found.</p></body></html>'
}
