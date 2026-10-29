import { createApp } from 'vue'
import '@/app/style.css'
import App from '@/app/App.vue'
import { initAuth } from '@/features/auth/useAuth'
import { i18n } from '@/shared/i18n'
import { router } from '@/app/router'

document.documentElement.lang = i18n.global.locale.value

// De app wordt meteen getoond; de route-guard wacht zelf op het herstellen van de sessie.
void initAuth()

createApp(App).use(router).use(i18n).mount('#app')
