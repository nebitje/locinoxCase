import { computed, readonly, ref } from 'vue'
import { setLocale } from '@/shared/i18n'
import { isAppLocale, type AppLocale } from '@/shared/i18n/locales'
import { supabase } from '@/shared/supabase'

export type UserRole = 'admin' | 'employee'

export interface Profile {
  id: string
  displayName: string
  role: UserRole
  preferredLanguage: AppLocale
}

const profile = ref<Profile | null>(null)
const ready = ref(false)

async function loadProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, role, preferred_language')
    .eq('id', userId)
    .maybeSingle()

  if (error || !data) return null

  return {
    id: data.id,
    displayName: data.display_name,
    role: data.role,
    preferredLanguage: isAppLocale(data.preferred_language) ? data.preferred_language : 'en',
  }
}

let initPromise: Promise<void> | null = null

/** Herstelt een bestaande sessie; veilig om meerdere keren aan te roepen. */
export function initAuth(): Promise<void> {
  initPromise ??= (async () => {
    const { data } = await supabase.auth.getSession()
    const user = data.session?.user
    profile.value = user ? await loadProfile(user.id) : null
    if (profile.value) setLocale(profile.value.preferredLanguage)
    ready.value = true
  })()
  return initPromise
}

export function useAuth() {
  async function signIn(email: string, password: string): Promise<boolean> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data.user) return false

    const loaded = await loadProfile(data.user.id)
    if (!loaded) {
      await supabase.auth.signOut()
      return false
    }

    profile.value = loaded
    setLocale(loaded.preferredLanguage)
    return true
  }

  async function signOut() {
    await supabase.auth.signOut()
    profile.value = null
  }

  return {
    profile: readonly(profile),
    ready: readonly(ready),
    isAuthenticated: computed(() => profile.value !== null),
    role: computed(() => profile.value?.role ?? null),
    signIn,
    signOut,
  }
}
