<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Campaign } from '../api'

defineProps<{ campaign: Campaign }>()

const { t } = useI18n()

const scroller = ref<HTMLElement | null>(null)
const active = ref(0)

function onScroll() {
  const el = scroller.value
  if (el) active.value = Math.round(el.scrollLeft / el.clientWidth)
}

function goTo(index: number) {
  const el = scroller.value
  if (el) el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' })
}
</script>

<template>
  <div class="relative overflow-hidden border border-line bg-surface-muted shadow-xl shadow-brand/5">
    <template v-if="campaign.format === 'carousel'">
      <div ref="scroller" class="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none]" @scroll.passive="onScroll">
        <img
          v-for="(item, index) in campaign.media"
          :key="item.url"
          :src="item.url"
          :alt="`${campaign.title} (${index + 1}/${campaign.media.length})`"
          class="aspect-square w-full shrink-0 snap-center object-cover"
        >
      </div>
      <div class="absolute inset-x-0 bottom-3 flex justify-center gap-2">
        <button
          v-for="(item, index) in campaign.media"
          :key="item.url"
          type="button"
          :aria-label="t('media.slide', { n: index + 1 })"
          :aria-current="active === index"
          :class="active === index ? 'w-7 bg-brand' : 'w-2.5 bg-surface/70 hover:bg-surface'"
          class="h-2.5 rounded-full shadow transition-all duration-300"
          @click="goTo(index)"
        />
      </div>
    </template>
    <video
      v-else-if="campaign.media[0]?.kind === 'video'"
      :src="campaign.media[0].url"
      class="w-full bg-black"
      controls
      playsinline
      preload="metadata"
    />
    <img v-else-if="campaign.media[0]" :src="campaign.media[0].url" :alt="campaign.title" class="w-full">
  </div>
</template>
