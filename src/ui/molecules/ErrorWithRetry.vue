<script setup lang="ts">
import BaseAlert from '@/ui/atoms/BaseAlert.vue'
import BaseButton from '@/ui/atoms/BaseButton.vue'

defineProps<{ message: string; retryLabel: string }>()

const emit = defineEmits<{ retry: [] }>()
</script>

<template>
  <BaseAlert tone="error">
    {{ message }}
    <BaseButton variant="link" class="ml-2" @click="emit('retry')">{{ retryLabel }}</BaseButton>
  </BaseAlert>
</template>
