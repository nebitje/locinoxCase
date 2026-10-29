<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { isAppLocale } from '@/shared/i18n/locales'
import BaseBadge from '@/ui/atoms/BaseBadge.vue'
import type { Campaign } from '../api'
import { pickVariants } from '../variants'

const props = withDefaults(
  defineProps<{
    campaign: Campaign
    /** Positie in de lijst; bepaalt hoe laat de kaart binnenkomt, zodat ze na elkaar verschijnen. */
    index?: number
  }>(),
  { index: 0 },
)

const { t, locale } = useI18n()

/** Korte tekst in de taal van de interface, met terugval op het Engels. */
const snippet = computed(() => {
  const wanted = isAppLocale(locale.value) ? locale.value : 'en'
  return pickVariants(props.campaign.variants, wanted).variants[0]?.copy ?? ''
})
</script>

<template>
  <article
    class="group flex animate-fade-up flex-col overflow-hidden border border-line bg-surface shadow-sm transition duration-300 [animation-delay:calc(var(--i)*80ms)] hover:-translate-y-1 hover:border-brand/60 hover:shadow-xl hover:shadow-brand/10"
    :style="{ '--i': index }"
  >
    <div class="relative aspect-video overflow-hidden bg-surface-muted">
      <video
        v-if="campaign.media[0]?.kind === 'video'"
        :src="campaign.media[0].url"
        class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        muted
        playsinline
        preload="metadata"
      />
      <img
        v-else-if="campaign.media[0]"
        :src="campaign.media[0].url"
        :alt="campaign.title"
        class="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        loading="lazy"
      >
      <span
        aria-hidden="true"
        class="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition duration-500 group-hover:opacity-100"
      />
      <BaseBadge class="absolute left-3 top-3">
        {{ t(`format.${campaign.format}`) }}
        <template v-if="campaign.format === 'carousel'"> · {{ campaign.media.length }}</template>
      </BaseBadge>
    </div>
    <div class="flex flex-1 flex-col gap-2 p-4">
      <h2 class="font-semibold transition-colors duration-300 group-hover:text-brand-text">{{ campaign.title }}</h2>
      <p class="line-clamp-3 whitespace-pre-line text-sm text-ink-muted">{{ snippet }}</p>
      <div class="mt-auto pt-3">
        <slot name="actions" />
      </div>
    </div>
  </article>
</template>
