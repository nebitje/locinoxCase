<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/shared/theme'

const { t } = useI18n()
const { theme, toggle } = useTheme()

const label = computed(() => (theme.value === 'dark' ? t('theme.toLight') : t('theme.toDark')))

/** De cirkel groeit vanuit het midden van de knop. */
function onClick(event: MouseEvent) {
  const box = (event.currentTarget as HTMLElement).getBoundingClientRect()
  toggle({ x: box.left + box.width / 2, y: box.top + box.height / 2 })
}
</script>

<template>
  <button
    type="button"
    :aria-label="label"
    :title="label"
    class="group grid h-9 w-9 place-items-center rounded-full border border-line bg-surface text-ink transition duration-300 hover:rotate-12 hover:border-brand hover:text-brand-text active:scale-90"
    @click="onClick"
  >
    <svg v-if="theme === 'dark'" viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
    <svg v-else viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  </button>
</template>
