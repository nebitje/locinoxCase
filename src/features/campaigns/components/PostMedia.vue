<script setup lang="ts">
import type { Campaign } from '../api'

defineProps<{ campaign: Campaign }>()
</script>

<template>
  <div v-if="campaign.format === 'carousel'" class="flex snap-x snap-mandatory gap-2 overflow-x-auto rounded-lg">
    <img
      v-for="(item, index) in campaign.media"
      :key="item.url"
      :src="item.url"
      :alt="`${campaign.title} (${index + 1}/${campaign.media.length})`"
      class="aspect-square w-full shrink-0 snap-center rounded-lg bg-slate-100 object-cover"
    >
  </div>
  <video
    v-else-if="campaign.media[0]?.kind === 'video'"
    :src="campaign.media[0].url"
    class="w-full rounded-lg bg-black"
    controls
    playsinline
    preload="metadata"
  />
  <img
    v-else-if="campaign.media[0]"
    :src="campaign.media[0].url"
    :alt="campaign.title"
    class="w-full rounded-lg bg-slate-100"
  >
</template>
