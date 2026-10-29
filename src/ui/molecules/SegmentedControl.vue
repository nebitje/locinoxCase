<script setup lang="ts">
import BaseChip from '@/ui/atoms/BaseChip.vue'

export interface SegmentOption {
  value: string
  label: string
  /** Korte markering achter het label, bijvoorbeeld een vinkje. Enkel visueel. */
  mark?: string
  /** Uitleg voor schermlezers, bijvoorbeeld wat de markering betekent. */
  srLabel?: string
}

withDefaults(
  defineProps<{
    options: SegmentOption[]
    /** `tabs`: wisselt tussen panelen. `toggle`: kiest één waarde uit een groep. */
    mode?: 'tabs' | 'toggle'
    ariaLabel?: string
  }>(),
  { mode: 'toggle', ariaLabel: undefined },
)

const model = defineModel<string>()
</script>

<template>
  <div :role="mode === 'tabs' ? 'tablist' : 'group'" :aria-label="ariaLabel" class="flex flex-wrap gap-2">
    <BaseChip
      v-for="option in options"
      :key="option.value"
      :selected="model === option.value"
      :role="mode === 'tabs' ? 'tab' : undefined"
      :aria-selected="mode === 'tabs' ? model === option.value : undefined"
      :aria-pressed="mode === 'toggle' ? model === option.value : undefined"
      @click="model = option.value"
    >
      {{ option.label }}
      <span v-if="option.mark" aria-hidden="true">{{ option.mark }}</span>
      <span v-if="option.srLabel" class="sr-only">{{ option.srLabel }}</span>
    </BaseChip>
  </div>
</template>
