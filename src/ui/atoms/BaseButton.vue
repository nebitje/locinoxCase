<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, type RouteLocationRaw } from 'vue-router'

type Variant = 'primary' | 'secondary' | 'link' | 'danger-link'
type Size = 'xs' | 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    block?: boolean
    type?: 'button' | 'submit'
    /** Als `to` is ingesteld, wordt de knop een link naar die route. */
    to?: RouteLocationRaw
  }>(),
  { variant: 'primary', size: 'md', type: 'button', to: undefined },
)

const classes = computed(() => {
  const variants: Record<Variant, string> = {
    primary: 'btn-shine rounded-full bg-brand font-semibold text-on-brand shadow-[0_6px_18px_-8px_var(--brand)] transition duration-300 hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-[0_12px_26px_-8px_var(--brand)] active:translate-y-0 active:scale-[0.98] disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none',
    secondary: 'rounded-full border border-line bg-surface text-ink transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:text-brand-text active:translate-y-0 active:scale-[0.98] disabled:opacity-60',
    link: 'text-brand-text underline underline-offset-4 transition-colors hover:text-brand disabled:opacity-60',
    'danger-link': 'text-danger underline underline-offset-4 transition-opacity hover:opacity-70 disabled:opacity-50',
  }
  const sizes: Record<Size, string> = {
    xs: 'px-3 py-1 text-sm',
    sm: 'px-4 py-2 text-sm',
    md: 'px-4 py-2',
    lg: 'px-4 py-3 text-base',
  }
  const spacing = props.variant === 'link' || props.variant === 'danger-link' ? 'text-sm' : sizes[props.size]
  return [variants[props.variant], spacing, props.block ? 'block w-full text-center' : 'inline-block']
})
</script>

<template>
  <RouterLink v-if="to" :to="to" :class="classes">
    <slot />
  </RouterLink>
  <button v-else :type="type" :class="classes">
    <slot />
  </button>
</template>
