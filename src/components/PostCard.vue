<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { Campaign } from '../lib/campaigns'

defineProps<{ campaign: Campaign }>()

const { t } = useI18n()
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
      <p class="line-clamp-3 whitespace-pre-line text-sm text-slate-600">{{ campaign.copy }}</p>
      <div class="mt-auto pt-2">
        <slot name="actions" />
      </div>
    </div>
  </article>
</template>
