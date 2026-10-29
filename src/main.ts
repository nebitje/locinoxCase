import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { initAuth } from './composables/useAuth'
import { i18n } from './i18n'
import { router } from './router'

document.documentElement.lang = i18n.global.locale.value

// De app wordt meteen getoond; de route-guard wacht zelf op het herstellen van de sessie.
void initAuth()

createApp(App).use(router).use(i18n).mount('#app')
