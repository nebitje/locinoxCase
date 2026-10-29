import { ref } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'locinox.theme'

/** Een bewaarde keuze wint van de systeemvoorkeur; zonder keuze volgt de app het systeem. */
export function resolveTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === 'light' || stored === 'dark') return stored
  return prefersDark ? 'dark' : 'light'
}

function readStored(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

const theme = ref<Theme>('light')

function apply(next: Theme) {
  theme.value = next
  document.documentElement.classList.toggle('dark', next === 'dark')
}

/** Zet het thema bij het opstarten. index.html doet hetzelfde vooraf, zodat de pagina niet knippert. */
export function initTheme() {
  apply(resolveTheme(readStored(), window.matchMedia('(prefers-color-scheme: dark)').matches))
}

export function useTheme() {
  function toggle() {
    const next: Theme = theme.value === 'dark' ? 'light' : 'dark'
    apply(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Opslag kan geblokkeerd zijn (privévenster); de keuze geldt dan enkel tot de pagina herlaadt.
    }
  }

  return { theme, toggle }
}
