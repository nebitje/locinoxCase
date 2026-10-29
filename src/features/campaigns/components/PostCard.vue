<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { isAppLocale } from '@/shared/i18n/locales'
import BaseBadge from '@/ui/atoms/BaseBadge.vue'
import type { Campaign } from '../api'
import { pickVariants } from '../variants'

const props = defineProps<{ campaign: Campaign }>()

const { t, locale } = useI18n()

/** Korte tekst in de taal van de interface, met terugval op het Engels. */
const snippet = computed(() => {
  const wanted = isAppLocale(locale.value) ? locale.value : 'en'
  return pickVariants(props.campaign.variants, wanted).variants[0]?.copy ?? ''
})
</script>

<template>
  <article class="flex flex-col overflow-hidden border border-line bg-surface shadow-sm">
    <div class="relative aspect-video bg-surface-muted">
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
      <BaseBadge class="absolute left-2 top-2">
        {{ t(`format.${campaign.format}`) }}
        <template v-if="campaign.format === 'carousel'"> · {{ campaign.media.length }}</template>
      </BaseBadge>
    </div>
    <div class="flex flex-1 flex-col gap-2 p-4">
      <h2 class="font-semibold">{{ campaign.title }}</h2>
      <p class="line-clamp-3 whitespace-pre-line text-sm text-ink-muted">{{ snippet }}</p>
      <div class="mt-auto pt-2">
        <slot name="actions" />
      </div>
    </div>
  </article>
</template>
