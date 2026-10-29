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

/** Past het thema toe met een cirkel die vanaf `origin` over het scherm uitwaaiert; zonder ondersteuning of bij verminderde beweging direct. */
function applyAnimated(next: Theme, origin?: { x: number; y: number }) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!origin || reduceMotion || !('startViewTransition' in document)) {
    apply(next)
    return
  }

  const { x, y } = origin
  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
  const transition = document.startViewTransition(() => apply(next))
  void transition.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 650, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
    )
  })
}

export function useTheme() {
  function toggle(origin?: { x: number; y: number }) {
    const next: Theme = theme.value === 'dark' ? 'light' : 'dark'
    applyAnimated(next, origin)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Opslag kan geblokkeerd zijn (privévenster); de keuze geldt dan enkel tot de pagina herlaadt.
    }
  }

  return { theme, toggle }
}
