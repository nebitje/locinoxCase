<script setup lang="ts">
defineProps<{ selected?: boolean }>()
</script>

<template>
  <button
    type="button"
    :class="selected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white'"
    class="rounded border px-3 py-1"
  >
    <slot />
  </button>
</template>
