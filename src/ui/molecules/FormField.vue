<script setup lang="ts">
defineProps<{
  label: string
  hint?: string
  /** `sm` is een kleiner label, bijvoorbeeld voor een veld binnen een groep. */
  size?: 'sm' | 'md'
}>()
</script>

<template>
  <label class="block text-sm">
    <span :class="size === 'sm' ? 'text-xs font-medium text-slate-600' : 'font-medium'">{{ label }}</span>
    <span v-if="hint" class="block text-xs text-slate-500">{{ hint }}</span>
    <span class="mt-1 block"><slot /></span>
  </label>
</template>
