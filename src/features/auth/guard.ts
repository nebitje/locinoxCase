import type { UserRole } from '@/features/auth/useAuth'

export interface GuardInput {
  /** Rollen die de route mogen openen; leeg of ontbrekend betekent publiek. */
  allowedRoles?: UserRole[]
  /** Rol van de ingelogde gebruiker, of null als niemand is ingelogd. */
  role: UserRole | null
  /** Route waar de ingelogde gebruiker standaard hoort te zijn. */
  isLoginRoute?: boolean
}

export function homePathForRole(role: UserRole): string {
  return role === 'admin' ? '/admin' : '/posts'
}

/** Geeft het pad terug waarnaar omgeleid moet worden, of null als de navigatie mag doorgaan. */
export function resolveRedirect({ allowedRoles, role, isLoginRoute }: GuardInput): string | null {
  if (isLoginRoute) return role ? homePathForRole(role) : null
  if (!allowedRoles || allowedRoles.length === 0) return null
  if (!role) return '/login'
  return allowedRoles.includes(role) ? null : homePathForRole(role)
}
