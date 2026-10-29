<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const model = defineModel<string>({ default: '' })
</script>

<template>
  <textarea v-model="model" v-bind="$attrs" class="w-full rounded border border-slate-300 bg-white px-3 py-2" />
</template>
