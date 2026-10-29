<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES } from '@/shared/i18n/locales'
import BaseAlert from '@/ui/atoms/BaseAlert.vue'
import BaseButton from '@/ui/atoms/BaseButton.vue'
import BaseInput from '@/ui/atoms/BaseInput.vue'
import FormField from '@/ui/molecules/FormField.vue'
import type { NewCampaign } from '../api'
import { MAX_CAROUSEL_SLIDES, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, validateMedia } from '../media-validation'
import { MAX_VARIANTS_PER_LANGUAGE, emptyCopyInput, hasCopy, toVariants, validateVariants } from '../variants'
import CopyEditor from './CopyEditor.vue'
import MediaPicker, { type MediaItem } from './MediaPicker.vue'

const MAX_TITLE = 120

const props = defineProps<{
  submitting: boolean
  progress: { done: number; total: number }
  failed: boolean
}>()

const emit = defineEmits<{ submit: [post: NewCampaign] }>()

const { t } = useI18n()

const title = ref('')
const copies = reactive(emptyCopyInput())
const items = ref<MediaItem[]>([])
const touched = ref(false)

const check = computed(() => validateMedia(items.value.map((item) => item.file)))
const formatLabel = computed(() => (check.value.ok && check.value.format ? t(`format.${check.value.format}`) : null))
const mediaMessage = computed(() => {
  if (!check.value.error) return null
  if (check.value.error === 'none') return touched.value ? t('media.errors.none') : null
  return t(`media.errors.${check.value.error}`, {
    file: check.value.fileName ?? '',
    maxImage: MAX_IMAGE_BYTES / 1024 / 1024,
    maxVideo: MAX_VIDEO_BYTES / 1024 / 1024,
    maxSlides: MAX_CAROUSEL_SLIDES,
  })
})

const variantsError = computed(() => validateVariants(copies))
const variantsMessage = computed(() => {
  const error = variantsError.value
  if (!error || !(touched.value || SUPPORTED_LOCALES.some((language) => hasCopy(copies, language)))) return null
  if (error.code === 'missingLanguages') {
    return t('post.errors.missingLanguages', {
      languages: error.languages.map((language) => t(`language.${language}`)).join(', '),
    })
  }
  return t(`post.errors.${error.code}`, { max: MAX_VARIANTS_PER_LANGUAGE })
})

const canSubmit = computed(
  () => !props.submitting && title.value.trim() !== '' && variantsError.value === null && check.value.ok,
)

function onSubmit() {
  touched.value = true
  if (!canSubmit.value) return
  emit('submit', {
    title: title.value.trim(),
    variants: toVariants(copies),
    files: items.value.map((item) => item.file),
  })
}
</script>

<template>
  <form class="space-y-5" novalidate @submit.prevent="onSubmit">
    <FormField :label="t('post.title')">
      <BaseInput v-model="title" type="text" required :maxlength="MAX_TITLE" />
    </FormField>

    <CopyEditor v-model="copies" :disabled="submitting" :message="variantsMessage" />

    <MediaPicker
      v-model="items"
      :disabled="submitting"
      :format-label="formatLabel"
      :message="mediaMessage"
      @chosen="touched = true"
    />

    <BaseAlert v-if="failed">{{ t('post.saveFailed') }}</BaseAlert>

    <BaseButton type="submit" block :disabled="!canSubmit">
      <template v-if="submitting">{{ t('post.uploading', { done: progress.done, total: progress.total }) }}</template>
      <template v-else>{{ t('post.save') }}</template>
    </BaseButton>
  </form>
</template>
