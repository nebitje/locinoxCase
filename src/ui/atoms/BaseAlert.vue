<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'error' | 'success' | 'warning'

const props = withDefaults(defineProps<{ tone?: Tone }>(), { tone: 'error' })

const classes = computed(
  () =>
    ({
      error: 'bg-red-50 text-red-700',
      success: 'bg-green-50 text-green-800',
      warning: 'bg-amber-50 text-amber-800',
    })[props.tone],
)
</script>

<template>
  <p :role="tone === 'error' ? 'alert' : 'status'" :class="classes" class="rounded px-3 py-2 text-sm">
    <slot />
  </p>
</template>
