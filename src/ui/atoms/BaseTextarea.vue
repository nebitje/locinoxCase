<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const model = defineModel<string>({ default: '' })
</script>

<template>
  <textarea v-model="model" v-bind="$attrs" class="w-full rounded-sm border border-line bg-surface px-3 py-2 text-ink placeholder:text-ink-subtle focus-visible:border-brand" />
</template>
