import { SUPPORTED_LOCALES, type AppLocale } from '../i18n/locales'

export const MAX_COPY_LENGTH = 3000
export const MAX_VARIANTS_PER_LANGUAGE = 5
/** Talen waarvoor de admin verplicht tekst invoert; Nederlands is optioneel. */
export const REQUIRED_LANGUAGES: AppLocale[] = ['en', 'fr', 'de']
/** Taal waarop teruggevallen wordt als een post geen tekst heeft in de gevraagde taal. */
export const FALLBACK_LANGUAGE: AppLocale = 'en'

export interface Variant {
  language: AppLocale
  variantNo: number
  copy: string
}

/** Invoer van het formulier: per taal een lijst teksten (lege teksten worden genegeerd). */
export type CopyInput = Record<AppLocale, string[]>

export function emptyCopyInput(): CopyInput {
  return Object.fromEntries(SUPPORTED_LOCALES.map((locale) => [locale, ['']])) as unknown as CopyInput
}

/** Zet de invoer om naar varianten: getrimd, zonder lege teksten, per taal doorlopend genummerd vanaf 1. */
export function toVariants(input: CopyInput): Variant[] {
  return SUPPORTED_LOCALES.flatMap((language) =>
    input[language]
      .map((copy) => copy.trim())
      .filter((copy) => copy !== '')
      .map((copy, index) => ({ language, variantNo: index + 1, copy })),
  )
}

export type VariantsError = { code: 'missingLanguages'; languages: AppLocale[] } | { code: 'tooMany' } | { code: 'tooLong' }

export function validateVariants(input: CopyInput): VariantsError | null {
  const variants = toVariants(input)
  const missing = REQUIRED_LANGUAGES.filter((language) => !variants.some((variant) => variant.language === language))
  if (missing.length > 0) return { code: 'missingLanguages', languages: missing }

  for (const language of SUPPORTED_LOCALES) {
    if (variants.filter((variant) => variant.language === language).length > MAX_VARIANTS_PER_LANGUAGE) {
      return { code: 'tooMany' }
    }
  }
  if (variants.some((variant) => variant.copy.length > MAX_COPY_LENGTH)) return { code: 'tooLong' }
  return null
}

/** Talen waarin een post tekst heeft, in de vaste volgorde van de interface. */
export function availableLanguages(variants: Variant[]): AppLocale[] {
  return SUPPORTED_LOCALES.filter((language) => variants.some((variant) => variant.language === language))
}

export interface VariantSelection {
  /** De taal waarvan de varianten daadwerkelijk getoond worden. */
  language: AppLocale
  variants: Variant[]
  /** Waar als de gevraagde taal ontbreekt en we moesten terugvallen. */
  fellBack: boolean
}

/** Varianten in de gevraagde taal; ontbreekt die, dan het Engels, en anders de eerste beschikbare taal. */
export function pickVariants(variants: Variant[], wanted: AppLocale): VariantSelection {
  const inLanguage = (language: AppLocale) =>
    variants.filter((variant) => variant.language === language).sort((a, b) => a.variantNo - b.variantNo)

  const direct = inLanguage(wanted)
  if (direct.length > 0) return { language: wanted, variants: direct, fellBack: false }

  const english = inLanguage(FALLBACK_LANGUAGE)
  if (english.length > 0) return { language: FALLBACK_LANGUAGE, variants: english, fellBack: true }

  const first = availableLanguages(variants)[0]
  if (first) return { language: first, variants: inLanguage(first), fellBack: true }

  return { language: wanted, variants: [], fellBack: true }
}
