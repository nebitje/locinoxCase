<script lang="ts">
export interface MediaItem {
  id: string
  file: File
  previewUrl: string
}
</script>

<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseAlert from '@/ui/atoms/BaseAlert.vue'
import BaseButton from '@/ui/atoms/BaseButton.vue'
import { ACCEPTED_TYPES, MAX_CAROUSEL_SLIDES, MAX_IMAGE_BYTES, MAX_VIDEO_BYTES, kindOf } from '../media-validation'

defineProps<{
  disabled?: boolean
  /** Vertaald label van het herkende formaat, bijvoorbeeld "Carousel". */
  formatLabel?: string | null
  message?: string | null
}>()

const emit = defineEmits<{ chosen: [] }>()

const items = defineModel<MediaItem[]>({ required: true })

const { t } = useI18n()

function onFilesChosen(event: Event) {
  const input = event.target as HTMLInputElement
  emit('chosen')
  for (const file of Array.from(input.files ?? [])) {
    items.value.push({ id: crypto.randomUUID(), file, previewUrl: URL.createObjectURL(file) })
  }
  input.value = ''
}

function removeItem(index: number) {
  const [removed] = items.value.splice(index, 1)
  if (removed) URL.revokeObjectURL(removed.previewUrl)
}

function moveItem(index: number, direction: -1 | 1) {
  const target = index + direction
  if (target < 0 || target >= items.value.length) return
  const next = [...items.value]
  const [moved] = next.splice(index, 1)
  if (moved) next.splice(target, 0, moved)
  items.value = next
}

onBeforeUnmount(() => items.value.forEach((item) => URL.revokeObjectURL(item.previewUrl)))
</script>

<template>
  <div class="text-sm">
    <span class="font-medium">{{ t('post.media') }}</span>
    <p class="text-xs text-slate-500">
      {{ t('media.help', { maxImage: MAX_IMAGE_BYTES / 1024 / 1024, maxVideo: MAX_VIDEO_BYTES / 1024 / 1024, maxSlides: MAX_CAROUSEL_SLIDES }) }}
    </p>
    <input
      type="file"
      multiple
      :accept="ACCEPTED_TYPES.join(',')"
      :disabled="disabled"
      class="mt-2 block w-full text-sm file:mr-3 file:rounded file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-white"
      @change="onFilesChosen"
    >

    <ul v-if="items.length > 0" class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
      <li v-for="(item, index) in items" :key="item.id" class="rounded border border-slate-200 bg-white p-2">
        <video
          v-if="kindOf(item.file) === 'video'"
          :src="item.previewUrl"
          class="aspect-video w-full rounded bg-slate-100 object-cover"
          muted
          playsinline
          controls
        />
        <img v-else :src="item.previewUrl" :alt="item.file.name" class="aspect-video w-full rounded bg-slate-100 object-cover">
        <p class="mt-1 truncate text-xs text-slate-600" :title="item.file.name">{{ index + 1 }}. {{ item.file.name }}</p>
        <div class="mt-1 flex gap-2 text-xs">
          <BaseButton
            variant="secondary"
            size="xs"
            :disabled="disabled || index === 0"
            :aria-label="t('media.moveUp')"
            @click="moveItem(index, -1)"
          >
            ←
          </BaseButton>
          <BaseButton
            variant="secondary"
            size="xs"
            :disabled="disabled || index === items.length - 1"
            :aria-label="t('media.moveDown')"
            @click="moveItem(index, 1)"
          >
            →
          </BaseButton>
          <BaseButton variant="danger-link" class="ml-auto" :disabled="disabled" @click="removeItem(index)">
            {{ t('media.remove') }}
          </BaseButton>
        </div>
      </li>
    </ul>

    <p v-if="formatLabel" class="mt-2 text-xs text-slate-600">{{ t('media.detected', { format: formatLabel }) }}</p>
    <BaseAlert v-if="message" class="mt-2">{{ message }}</BaseAlert>
  </div>
</template>
