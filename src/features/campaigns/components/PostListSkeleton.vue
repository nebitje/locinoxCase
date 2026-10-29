<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <div>
    <p role="status" class="sr-only">{{ label }}</p>
    <ul class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      <li
        v-for="n in 6"
        :key="n"
        class="animate-fade-up overflow-hidden border border-line bg-surface [animation-delay:calc(var(--i)*70ms)]"
        :style="{ '--i': n }"
      >
        <div class="skeleton aspect-video" />
        <div class="space-y-3 p-4">
          <div class="skeleton h-4 w-2/3 rounded-sm" />
          <div class="skeleton h-3 w-full rounded-sm" />
          <div class="skeleton h-3 w-4/5 rounded-sm" />
          <div class="skeleton mt-4 h-9 w-full rounded-full" />
        </div>
      </li>
    </ul>
  </div>
</template>
