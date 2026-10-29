// Bewaakt de mappenstructuur (zie docs/architectuur.md): wie mag wie importeren.
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const SRC = resolve(import.meta.dirname, '../src')

/** Toegestane afhankelijkheden per laag: een laag mag enkel de lagen eronder gebruiken. */
const ALLOWED: Record<string, string[]> = {
  shared: ['shared'],
  ui: ['shared', 'ui'],
  features: ['shared', 'ui', 'features'],
  pages: ['shared', 'ui', 'features', 'pages'],
  app: ['shared', 'ui', 'features', 'pages', 'app'],
}

/** Een feature mag enkel de hier genoemde andere features gebruiken. */
const FEATURE_DEPENDENCIES: Record<string, string[]> = {
  auth: [],
  campaigns: [],
  sharing: ['campaigns'],
}

function filesIn(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return filesIn(path)
    return /\.(ts|vue)$/.test(name) && !/\.test\.ts$/.test(name) && !name.endsWith('.d.ts') ? [path] : []
  })
}

function importsOf(file: string): string[] {
  const text = readFileSync(file, 'utf8')
  return [...text.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)].map((match) => match[1]!)
}

function layerOf(path: string): { layer: string; feature?: string } | null {
  const [layer, feature] = relative(SRC, path).split(/[\\/]/)
  if (!layer || !(layer in ALLOWED)) return null
  return { layer, feature: layer === 'features' ? feature : undefined }
}

const sources = filesIn(SRC).filter((file) => layerOf(file))

describe('architectuur', () => {
  it('vindt bronbestanden in alle lagen', () => {
    for (const layer of Object.keys(ALLOWED)) {
      expect(sources.some((file) => layerOf(file)?.layer === layer), `laag ${layer}`).toBe(true)
    }
  })

  it('laat elke laag enkel de toegestane lagen importeren', () => {
    const violations: string[] = []
    for (const file of sources) {
      const from = layerOf(file)!
      for (const spec of importsOf(file)) {
        if (!spec.startsWith('@/')) continue
        const to = layerOf(resolve(SRC, spec.slice(2)))
        if (to && !ALLOWED[from.layer]!.includes(to.layer)) {
          violations.push(`${relative(SRC, file)} (${from.layer}) importeert ${spec} (${to.layer})`)
        }
      }
    }
    expect(violations).toEqual([])
  })

  it('houdt features onafhankelijk van elkaar, behalve de benoemde afhankelijkheden', () => {
    const violations: string[] = []
    for (const file of sources) {
      const from = layerOf(file)!
      if (from.layer !== 'features') continue
      for (const spec of importsOf(file)) {
        if (!spec.startsWith('@/features/')) continue
        const target = spec.split('/')[2]!
        if (target !== from.feature && !FEATURE_DEPENDENCIES[from.feature!]?.includes(target)) {
          violations.push(`${relative(SRC, file)} (feature ${from.feature}) importeert feature ${target}`)
        }
      }
    }
    expect(violations).toEqual([])
  })

  it('gebruikt relatieve imports enkel binnen dezelfde map of een submap', () => {
    const violations: string[] = []
    for (const file of sources) {
      for (const spec of importsOf(file)) {
        if (!spec.startsWith('../')) continue
        const target = resolve(dirname(file), spec)
        const from = layerOf(file)!
        const to = layerOf(target)
        const sameFeature = from.layer !== 'features' || from.feature === to?.feature
        if (!to || to.layer !== from.layer || !sameFeature) {
          violations.push(`${relative(SRC, file)} gebruikt ${spec}; gebruik de @-alias voor andere lagen of features`)
        }
      }
    }
    expect(violations).toEqual([])
  })

  it('gebruikt enkel kleurtokens en geen losse Tailwind-kleuren, zodat de donkere modus overal werkt', () => {
    const loose =
      /\b(?:[a-z-]+:)*(?:bg|text|border|ring|fill|stroke|divide|outline|from|via|to)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}\b|\bbg-white\b/
    const violations = sources
      .filter((file) => file.endsWith('.vue'))
      .filter((file) => loose.test(readFileSync(file, 'utf8')))
      .map((file) => relative(SRC, file))
    expect(violations).toEqual([])
  })

  it('houdt media-validation vrij van imports, want Node-scripts lezen dat bestand rechtstreeks', () => {
    expect(importsOf(join(SRC, 'features/campaigns/media-validation.ts'))).toEqual([])
  })
})
