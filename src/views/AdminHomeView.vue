<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-10">
    <h1 class="text-2xl font-semibold">{{ t('admin.title') }}</h1>
    <p class="mt-2 text-slate-600">{{ t('admin.placeholder') }}</p>
  </section>
</template>
