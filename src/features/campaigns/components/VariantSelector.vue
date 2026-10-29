<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { AppLocale } from '@/shared/i18n/locales'
import BaseAlert from '@/ui/atoms/BaseAlert.vue'
import SegmentedControl from '@/ui/molecules/SegmentedControl.vue'
import type { Variant, VariantSelection } from '../variants'

const props = defineProps<{
  languages: AppLocale[]
  selection: VariantSelection
  /** De taal die de medewerker wil zien; kan afwijken van `selection.language` bij terugval. */
  wantedLanguage: AppLocale
  selected: Variant | null
}>()

const emit = defineEmits<{ 'update:language': [language: AppLocale] }>()

const variantNo = defineModel<number>('variantNo', { required: true })

const { t } = useI18n()

const languageOptions = computed(() => props.languages.map((code) => ({ value: code, label: code.toUpperCase() })))
</script>

<template>
  <div v-if="languages.length > 1" class="mt-4 flex flex-wrap items-center gap-2 text-sm">
    <span class="text-ink-muted">{{ t('employee.postLanguage') }}</span>
    <SegmentedControl
      :model-value="selection.language"
      :options="languageOptions"
      :aria-label="t('employee.postLanguage')"
      @update:model-value="emit('update:language', $event as AppLocale)"
    />
  </div>
  <BaseAlert v-if="selection.fellBack && selection.variants.length > 0" tone="warning" class="mt-2">
    {{ t('employee.fallbackNote', { wanted: t(`language.${wantedLanguage}`), shown: t(`language.${selection.language}`) }) }}
  </BaseAlert>

  <fieldset v-if="selection.variants.length > 1" class="mt-3 space-y-2">
    <legend class="text-sm text-ink-muted">{{ t('employee.chooseVariant') }}</legend>
    <label
      v-for="item in selection.variants"
      :key="item.variantNo"
      :class="selected?.variantNo === item.variantNo ? 'border-brand ring-1 ring-brand' : 'border-line'"
      class="flex cursor-pointer gap-3 rounded border bg-surface p-3"
    >
      <input v-model="variantNo" type="radio" name="variant" :value="item.variantNo" class="mt-1">
      <span>
        <span class="block text-xs font-medium text-ink-subtle">{{ t('employee.variant', { n: item.variantNo }) }}</span>
        <span class="block whitespace-pre-line text-ink">{{ item.copy }}</span>
      </span>
    </label>
  </fieldset>
  <p v-else class="mt-3 whitespace-pre-line text-ink">{{ selected?.copy }}</p>
</template>
