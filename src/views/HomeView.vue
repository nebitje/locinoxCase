<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section class="mx-auto max-w-xl px-4 py-16 text-center">
    <h1 class="text-3xl font-semibold">{{ t('home.title') }}</h1>
    <p class="mt-3 text-slate-600">{{ t('app.tagline') }}</p>
    <p class="mt-6 text-sm text-slate-500">{{ t('home.status') }}</p>
  </section>
</template>
