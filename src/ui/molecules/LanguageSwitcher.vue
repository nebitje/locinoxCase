<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/shared/i18n'
import { SUPPORTED_LOCALES, isAppLocale } from '@/shared/i18n/locales'

const { t, locale } = useI18n()

function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value
  if (isAppLocale(value)) setLocale(value)
}
</script>

<template>
  <label class="flex items-center gap-2">
    <span class="sr-only sm:not-sr-only">{{ t('language.label') }}</span>
    <select :value="locale" class="rounded border border-slate-300 bg-white px-2 py-1" @change="onChange">
      <option v-for="code in SUPPORTED_LOCALES" :key="code" :value="code">
        {{ t(`language.${code}`) }}
      </option>
    </select>
  </label>
</template>
