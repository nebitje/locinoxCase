<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { PostFormat } from '@/features/campaigns/media-validation'
import BaseAlert from '@/ui/atoms/BaseAlert.vue'
import BaseButton from '@/ui/atoms/BaseButton.vue'
import type { StatusMessage } from '../useSharePost'
import type { ShareMethod } from '../share'

defineProps<{
  method: ShareMethod
  format: PostFormat
  /** Waar als de bestanden klaarstaan (op mobiel); anders is delen nog niet mogelijk. */
  ready: boolean
  preparing: boolean
  busy: boolean
  isMobile: boolean
  canCopyImage: boolean
  status: StatusMessage | null
}>()

const emit = defineEmits<{ share: []; copyImage: [] }>()

const { t } = useI18n()
</script>

<template>
  <div class="mt-6 space-y-3">
    <BaseButton block size="lg" :disabled="!ready || busy" @click="emit('share')">
      <template v-if="!ready">{{ t('share.preparing') }}</template>
      <template v-else-if="busy">{{ t('share.sharing') }}</template>
      <template v-else>{{ method === 'native' ? t('share.button.native') : t('share.button.linkedin') }}</template>
    </BaseButton>

    <BaseButton v-if="canCopyImage" variant="secondary" size="sm" block @click="emit('copyImage')">
      {{ t('share.copyImage') }}
    </BaseButton>

    <BaseAlert v-if="status" :tone="status.tone">{{ t(`share.status.${status.key}`) }}</BaseAlert>

    <p v-if="method === 'native'" class="text-xs text-ink-subtle">{{ t('share.hint.native') }}</p>
    <p v-else-if="!preparing" class="text-xs text-ink-subtle">
      {{ format === 'image' ? t('share.hint.linkedinImage') : t('share.hint.linkedinMedia') }}
      <template v-if="!isMobile"> {{ t('share.hint.desktopPhone') }}</template>
    </p>
  </div>
</template>
