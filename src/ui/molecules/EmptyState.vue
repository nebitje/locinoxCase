<script setup lang="ts">
defineProps<{ message: string }>()
</script>

<template>
  <div class="animate-fade-up py-16 text-center">
    <svg viewBox="0 0 120 120" class="mx-auto h-28 w-28 animate-float text-ink-subtle" fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="52" fill="color-mix(in srgb, var(--brand) 8%, transparent)" />
      <rect x="34" y="54" width="52" height="38" rx="6" stroke="currentColor" stroke-width="3" />
      <path d="M44 54V42a16 16 0 0 1 32 0v12" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <circle cx="60" cy="71" r="5" fill="var(--brand)" />
      <path d="M60 76v7" stroke="var(--brand)" stroke-width="3" stroke-linecap="round" />
    </svg>
    <p class="mx-auto mt-4 max-w-sm text-ink-muted">{{ message }}</p>
  </div>
</template>
