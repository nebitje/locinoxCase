<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES, type AppLocale } from '@/shared/i18n/locales'
import BaseAlert from '@/ui/atoms/BaseAlert.vue'
import BaseButton from '@/ui/atoms/BaseButton.vue'
import BaseTextarea from '@/ui/atoms/BaseTextarea.vue'
import FormField from '@/ui/molecules/FormField.vue'
import SegmentedControl from '@/ui/molecules/SegmentedControl.vue'
import {
  MAX_COPY_LENGTH,
  MAX_VARIANTS_PER_LANGUAGE,
  REQUIRED_LANGUAGES,
  hasCopy,
  type CopyInput,
} from '../variants'

defineProps<{ disabled?: boolean; message?: string | null }>()

const copies = defineModel<CopyInput>({ required: true })

const { t } = useI18n()

const active = ref<string>('en')

const tabs = computed(() =>
  SUPPORTED_LOCALES.map((language) => {
    const filled = hasCopy(copies.value, language)
    const required = REQUIRED_LANGUAGES.includes(language)
    return {
      value: language,
      label: language.toUpperCase(),
      mark: filled ? '✓' : required ? '*' : undefined,
      srLabel: filled ? t('post.tabFilled') : required ? t('post.tabRequired') : t('post.tabOptional'),
    }
  }),
)

function addVariant(language: AppLocale) {
  if (copies.value[language].length < MAX_VARIANTS_PER_LANGUAGE) copies.value[language].push('')
}

function removeVariant(language: AppLocale, index: number) {
  copies.value[language].splice(index, 1)
  if (copies.value[language].length === 0) copies.value[language].push('')
}
</script>

<template>
  <div class="text-sm">
    <span class="font-medium">{{ t('post.copy') }}</span>
    <p class="text-xs text-slate-500">{{ t('post.copyHelp') }}</p>

    <SegmentedControl v-model="active" mode="tabs" :options="tabs" class="mt-2" />

    <div v-for="language in SUPPORTED_LOCALES" v-show="active === language" :key="language" class="mt-3 space-y-3">
      <div v-for="(_, index) in copies[language]" :key="index">
        <FormField size="sm" :label="t('post.variant', { n: index + 1, language: t(`language.${language}`) })">
          <BaseTextarea v-model="copies[language][index]" rows="5" :maxlength="MAX_COPY_LENGTH" :disabled="disabled" />
        </FormField>
        <div class="flex items-center justify-between text-xs text-slate-500">
          <span>{{ copies[language][index]?.length ?? 0 }} / {{ MAX_COPY_LENGTH }}</span>
          <BaseButton
            v-if="copies[language].length > 1"
            variant="danger-link"
            :disabled="disabled"
            @click="removeVariant(language, index)"
          >
            {{ t('post.removeVariant') }}
          </BaseButton>
        </div>
      </div>
      <BaseButton
        v-if="copies[language].length < MAX_VARIANTS_PER_LANGUAGE"
        variant="secondary"
        size="xs"
        :disabled="disabled"
        @click="addVariant(language)"
      >
        {{ t('post.addVariant') }}
      </BaseButton>
    </div>

    <BaseAlert v-if="message" class="mt-2">{{ message }}</BaseAlert>
  </div>
</template>
