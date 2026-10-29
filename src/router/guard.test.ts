import { describe, expect, it } from 'vitest'
import { homePathForRole, resolveRedirect } from './guard'

describe('resolveRedirect', () => {
  it('stuurt een anonieme bezoeker van een beschermde route naar de login', () => {
    expect(resolveRedirect({ allowedRoles: ['admin'], role: null })).toBe('/login')
    expect(resolveRedirect({ allowedRoles: ['employee'], role: null })).toBe('/login')
  })

  it('laat een admin op de admin-route', () => {
    expect(resolveRedirect({ allowedRoles: ['admin'], role: 'admin' })).toBeNull()
  })

  it('stuurt een medewerker weg van een admin-route', () => {
    expect(resolveRedirect({ allowedRoles: ['admin'], role: 'employee' })).toBe('/posts')
  })

  it('stuurt een admin weg van een medewerker-route', () => {
    expect(resolveRedirect({ allowedRoles: ['employee'], role: 'admin' })).toBe('/admin')
  })

  it('laat publieke routes door', () => {
    expect(resolveRedirect({ role: null })).toBeNull()
    expect(resolveRedirect({ allowedRoles: [], role: 'employee' })).toBeNull()
  })

  it('stuurt een ingelogde gebruiker van de login naar zijn startpagina', () => {
    expect(resolveRedirect({ isLoginRoute: true, role: 'admin' })).toBe(homePathForRole('admin'))
    expect(resolveRedirect({ isLoginRoute: true, role: 'employee' })).toBe('/posts')
    expect(resolveRedirect({ isLoginRoute: true, role: null })).toBeNull()
  })
})
