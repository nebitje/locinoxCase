<script setup lang="ts">
import BaseButton from '@/ui/atoms/BaseButton.vue'
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
  <header class="flex flex-wrap items-center justify-between gap-2 border-b border-t-4 border-b-line border-t-brand bg-surface px-4 py-3">
    <span class="text-lg font-bold uppercase tracking-wider">{{ appName }}</span>
    <div class="flex items-center gap-3 text-sm text-ink-muted">
      <LanguageSwitcher />
      <ThemeToggle />
      <template v-if="userName">
        <span class="hidden sm:inline">{{ userName }}</span>
        <BaseButton variant="secondary" size="xs" @click="emit('signOut')">{{ signOutLabel }}</BaseButton>
      </template>
    </div>
  </header>
</template>
