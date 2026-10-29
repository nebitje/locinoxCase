<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { isAppLocale } from '@/shared/i18n/locales'
import type { Campaign } from '@/features/campaigns/api'
import { pickVariants } from '@/features/campaigns/variants'

const props = defineProps<{ campaign: Campaign }>()

const { t, locale } = useI18n()

/** Korte tekst in de taal van de interface, met terugval op het Engels. */
const snippet = computed(() => {
  const wanted = isAppLocale(locale.value) ? locale.value : 'en'
  return pickVariants(props.campaign.variants, wanted).variants[0]?.copy ?? ''
})
</script>

<template>
  <article class="flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white">
    <div class="relative aspect-video bg-slate-100">
      <video
        v-if="campaign.media[0]?.kind === 'video'"
        :src="campaign.media[0].url"
        class="h-full w-full object-cover"
        muted
        playsinline
        preload="metadata"
      />
      <img
        v-else-if="campaign.media[0]"
        :src="campaign.media[0].url"
        :alt="campaign.title"
        class="h-full w-full object-cover"
        loading="lazy"
      >
      <span class="absolute left-2 top-2 rounded bg-slate-900/80 px-2 py-0.5 text-xs font-medium text-white">
        {{ t(`format.${campaign.format}`) }}
        <template v-if="campaign.format === 'carousel'"> · {{ campaign.media.length }}</template>
      </span>
    </div>
    <div class="flex flex-1 flex-col gap-2 p-4">
      <h2 class="font-semibold">{{ campaign.title }}</h2>
      <p class="line-clamp-3 whitespace-pre-line text-sm text-slate-600">{{ snippet }}</p>
      <div class="mt-auto pt-2">
        <slot name="actions" />
      </div>
    </div>
  </article>
</template>
