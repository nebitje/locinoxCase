<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuth } from '@/features/auth/useAuth'
import { setLocale } from '@/shared/i18n'
import { SUPPORTED_LOCALES, isAppLocale } from '@/shared/i18n/locales'

const { t, locale } = useI18n()
const router = useRouter()
const { profile, ready, isAuthenticated, signOut } = useAuth()

function onLocaleChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  if (isAppLocale(value)) setLocale(value)
}

async function onSignOut() {
  await signOut()
  await router.replace('/login')
}
</script>

<template>
  <header class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-white px-4 py-3">
    <span class="font-semibold">{{ t('app.name') }}</span>
    <div class="flex items-center gap-3 text-sm text-slate-600">
      <label class="flex items-center gap-2">
        <span class="sr-only sm:not-sr-only">{{ t('language.label') }}</span>
        <select
          :value="locale"
          class="rounded border border-slate-300 bg-white px-2 py-1"
          @change="onLocaleChange"
        >
          <option v-for="code in SUPPORTED_LOCALES" :key="code" :value="code">
            {{ t(`language.${code}`) }}
          </option>
        </select>
      </label>
      <template v-if="isAuthenticated && profile">
        <span class="hidden sm:inline">{{ profile.displayName }}</span>
        <button type="button" class="rounded border border-slate-300 px-3 py-1" @click="onSignOut">
          {{ t('auth.signOut') }}
        </button>
      </template>
    </div>
  </header>
  <main>
    <p v-if="!ready" role="status" class="px-4 py-10 text-center text-sm text-slate-500">
      {{ t('common.loading') }}
    </p>
    <RouterView v-else />
  </main>
</template>
