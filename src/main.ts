import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { initAuth } from './composables/useAuth'
import { i18n } from './i18n'
import { router } from './router'

document.documentElement.lang = i18n.global.locale.value

// De sessie wordt eerst hersteld, zodat de route-guard de rol kent bij de eerste navigatie.
await initAuth()

createApp(App).use(router).use(i18n).mount('#app')
