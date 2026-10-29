<script setup lang="ts">
defineProps<{ selected?: boolean }>()
</script>

<template>
  <button
    type="button"
    :class="selected ? 'border-brand bg-brand text-on-brand' : 'border-line bg-surface text-ink hover:border-brand'"
    class="rounded-full border px-3 py-1 font-semibold"
  >
    <slot />
  </button>
</template>
