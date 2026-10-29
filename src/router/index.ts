import { createRouter, createWebHistory } from 'vue-router'
import { initAuth, useAuth, type UserRole } from '../composables/useAuth'
import { homePathForRole, resolveRedirect } from './guard'

declare module 'vue-router' {
  interface RouteMeta {
    roles?: UserRole[]
  }
}

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'root', component: () => import('../views/LoginView.vue') },
    { path: '/login', name: 'login', component: () => import('../views/LoginView.vue') },
    {
      path: '/admin',
      name: 'admin-home',
      component: () => import('../views/AdminHomeView.vue'),
      meta: { roles: ['admin'] },
    },
    {
      path: '/admin/posts/new',
      name: 'admin-post-new',
      component: () => import('../views/AdminPostNewView.vue'),
      meta: { roles: ['admin'] },
    },
    {
      path: '/posts',
      name: 'employee-home',
      component: () => import('../views/EmployeeHomeView.vue'),
      meta: { roles: ['employee'] },
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach(async (to) => {
  // De app is al zichtbaar; de eerste navigatie wacht tot de sessie hersteld is.
  await initAuth()
  const { role } = useAuth()

  if (to.name === 'root') return role.value ? homePathForRole(role.value) : '/login'

  const target = resolveRedirect({
    allowedRoles: to.meta.roles,
    role: role.value,
    isLoginRoute: to.name === 'login',
  })
  return target ?? true
})
