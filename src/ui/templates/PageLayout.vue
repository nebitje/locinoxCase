<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{ width?: 'narrow' | 'medium' | 'wide' }>(), { width: 'wide' })

const widthClass = computed(() => ({ narrow: 'max-w-sm', medium: 'max-w-2xl', wide: 'max-w-5xl' })[props.width])
</script>

<template>
  <section :class="widthClass" class="mx-auto px-4 py-8">
    <slot />
  </section>
</template>
