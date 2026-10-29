import { createI18n } from 'vue-i18n'
import { DEFAULT_LOCALE, isAppLocale, type AppLocale } from './locales'
import de from '@/shared/i18n/messages/de'
import en from '@/shared/i18n/messages/en'
import fr from '@/shared/i18n/messages/fr'
import nl from '@/shared/i18n/messages/nl'

const STORAGE_KEY = 'locinox.locale'

export const messages = { en, fr, de, nl }

function detectInitialLocale(): AppLocale {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (isAppLocale(stored)) return stored

  const browserLocale = navigator.language.slice(0, 2).toLowerCase()
  return isAppLocale(browserLocale) ? browserLocale : DEFAULT_LOCALE
}

export const i18n = createI18n({
  legacy: false,
  locale: detectInitialLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages,
})

export function setLocale(locale: AppLocale) {
  i18n.global.locale.value = locale
  localStorage.setItem(STORAGE_KEY, locale)
  document.documentElement.lang = locale
}
