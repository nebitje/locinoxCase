<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseAlert from '@/ui/atoms/BaseAlert.vue'
import BaseButton from '@/ui/atoms/BaseButton.vue'
import BaseInput from '@/ui/atoms/BaseInput.vue'
import FormField from '@/ui/molecules/FormField.vue'

defineProps<{ loading: boolean; failed: boolean }>()

const emit = defineEmits<{ submit: [email: string, password: string] }>()

const { t } = useI18n()

const email = ref('')
const password = ref('')
</script>

<template>
  <form class="space-y-4" @submit.prevent="emit('submit', email.trim(), password)">
    <FormField :label="t('login.email')">
      <BaseInput v-model="email" type="email" required autocomplete="username" />
    </FormField>
    <FormField :label="t('login.password')">
      <BaseInput v-model="password" type="password" required autocomplete="current-password" />
    </FormField>

    <BaseAlert v-if="failed">{{ t('login.failed') }}</BaseAlert>

    <BaseButton type="submit" block :disabled="loading">
      {{ loading ? t('login.loading') : t('login.submit') }}
    </BaseButton>
  </form>
</template>
