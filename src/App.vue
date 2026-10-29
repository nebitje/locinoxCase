<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES, isAppLocale } from './i18n/locales'
import { setLocale } from './i18n'

const { t, locale } = useI18n()

function onLocaleChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  if (isAppLocale(value)) setLocale(value)
}
</script>

<template>
  <header class="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
    <span class="font-semibold">{{ t('app.name') }}</span>
    <label class="flex items-center gap-2 text-sm text-slate-600">
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
  </header>
  <main>
    <RouterView />
  </main>
</template>
