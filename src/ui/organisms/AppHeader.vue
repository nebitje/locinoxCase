<script setup lang="ts">
import BaseButton from '@/ui/atoms/BaseButton.vue'
import BrandMark from '@/ui/atoms/BrandMark.vue'
import LanguageSwitcher from '@/ui/molecules/LanguageSwitcher.vue'
import ThemeToggle from '@/ui/molecules/ThemeToggle.vue'

defineProps<{
  appName: string
  /** Naam van de ingelogde gebruiker; zonder naam worden de naam en de knop om uit te loggen niet getoond. */
  userName?: string
  signOutLabel: string
}>()

const emit = defineEmits<{ signOut: [] }>()
</script>

<template>
  <header class="sticky top-0 z-30 border-b border-line bg-surface/80 backdrop-blur-md">
    <span aria-hidden="true" class="absolute inset-x-0 top-0 h-1 origin-left animate-grow-x bg-brand" />
    <div class="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-4 py-3">
      <span class="flex items-center gap-2.5 text-base font-bold uppercase tracking-wider sm:text-lg">
        <BrandMark class="h-7 w-7 animate-pop" />
        {{ appName }}
      </span>
      <div class="flex items-center gap-3 text-sm text-ink-muted">
        <LanguageSwitcher />
        <ThemeToggle />
        <template v-if="userName">
          <span class="hidden sm:inline">{{ userName }}</span>
          <BaseButton variant="secondary" size="xs" @click="emit('signOut')">{{ signOutLabel }}</BaseButton>
        </template>
      </div>
    </div>
  </header>
</template>
