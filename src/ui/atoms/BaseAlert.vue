<script setup lang="ts">
import { computed } from 'vue'

type Tone = 'error' | 'success' | 'warning'

const props = withDefaults(defineProps<{ tone?: Tone }>(), { tone: 'error' })

const classes = computed(
  () =>
    ({
      error: 'border-danger bg-danger-soft text-danger',
      success: 'border-success bg-success-soft text-success',
      warning: 'border-warning bg-warning-soft text-warning',
    })[props.tone],
)
</script>

<template>
  <p :role="tone === 'error' ? 'alert' : 'status'" :class="classes" class="animate-pop border-l-4 px-3 py-2 text-sm">
    <slot />
  </p>
</template>
