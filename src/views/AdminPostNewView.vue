<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { createCampaign } from '../lib/campaigns'
import {
  ACCEPTED_TYPES,
  MAX_CAROUSEL_SLIDES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
  kindOf,
  validateMedia,
} from '../lib/media-validation'

interface Item {
  id: string
  file: File
  previewUrl: string
}

const MAX_TITLE = 120
const MAX_COPY = 3000

const { t } = useI18n()
const router = useRouter()
const { profile } = useAuth()

const title = ref('')
const copy = ref('')
const items = ref<Item[]>([])
const submitting = ref(false)
const progress = ref({ done: 0, total: 0 })
const submitFailed = ref(false)
const touched = ref(false)

const check = computed(() => validateMedia(items.value.map((item) => item.file)))
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
const canSubmit = computed(
  () => !submitting.value && title.value.trim() !== '' && copy.value.trim() !== '' && check.value.ok,
)

function onFilesChosen(event: Event) {
  const input = event.target as HTMLInputElement
  touched.value = true
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

async function onSubmit() {
  touched.value = true
  if (!canSubmit.value || !profile.value) return

  submitting.value = true
  submitFailed.value = false
  progress.value = { done: 0, total: items.value.length }
  try {
    await createCampaign(
      { title: title.value.trim(), copy: copy.value.trim(), files: items.value.map((item) => item.file) },
      profile.value.id,
      (done, total) => (progress.value = { done, total }),
    )
    await router.replace({ path: '/admin', query: { created: '1' } })
  } catch {
    submitFailed.value = true
  } finally {
    submitting.value = false
  }
}

onBeforeUnmount(() => items.value.forEach((item) => URL.revokeObjectURL(item.previewUrl)))
</script>

<template>
  <section class="mx-auto max-w-2xl px-4 py-8">
    <RouterLink to="/admin" class="text-sm text-slate-600 underline">{{ t('common.back') }}</RouterLink>
    <h1 class="mt-2 text-2xl font-semibold">{{ t('admin.newPost') }}</h1>

    <form class="mt-6 space-y-5" novalidate @submit.prevent="onSubmit">
      <label class="block text-sm">
        <span class="font-medium">{{ t('post.title') }}</span>
        <input
          v-model="title"
          type="text"
          required
          :maxlength="MAX_TITLE"
          class="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2"
        >
      </label>

      <label class="block text-sm">
        <span class="font-medium">{{ t('post.copy') }}</span>
        <textarea
          v-model="copy"
          required
          rows="6"
          :maxlength="MAX_COPY"
          class="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2"
        />
        <span class="text-xs text-slate-500">{{ copy.length }} / {{ MAX_COPY }}</span>
      </label>

      <div class="text-sm">
        <span class="font-medium">{{ t('post.media') }}</span>
        <p class="text-xs text-slate-500">
          {{ t('media.help', { maxImage: MAX_IMAGE_BYTES / 1024 / 1024, maxVideo: MAX_VIDEO_BYTES / 1024 / 1024, maxSlides: MAX_CAROUSEL_SLIDES }) }}
        </p>
        <input
          type="file"
          multiple
          :accept="ACCEPTED_TYPES.join(',')"
          :disabled="submitting"
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
            <img
              v-else
              :src="item.previewUrl"
              :alt="item.file.name"
              class="aspect-video w-full rounded bg-slate-100 object-cover"
            >
            <p class="mt-1 truncate text-xs text-slate-600" :title="item.file.name">{{ index + 1 }}. {{ item.file.name }}</p>
            <div class="mt-1 flex gap-2 text-xs">
              <button
                type="button"
                :disabled="submitting || index === 0"
                :aria-label="t('media.moveUp')"
                class="rounded border border-slate-300 px-2 py-1 disabled:opacity-40"
                @click="moveItem(index, -1)"
              >
                ←
              </button>
              <button
                type="button"
                :disabled="submitting || index === items.length - 1"
                :aria-label="t('media.moveDown')"
                class="rounded border border-slate-300 px-2 py-1 disabled:opacity-40"
                @click="moveItem(index, 1)"
              >
                →
              </button>
              <button
                type="button"
                :disabled="submitting"
                class="ml-auto text-red-700 underline"
                @click="removeItem(index)"
              >
                {{ t('media.remove') }}
              </button>
            </div>
          </li>
        </ul>

        <p v-if="check.ok && check.format" class="mt-2 text-xs text-slate-600">
          {{ t('media.detected', { format: t(`format.${check.format}`) }) }}
        </p>
        <p v-if="mediaMessage" role="alert" class="mt-2 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
          {{ mediaMessage }}
        </p>
      </div>

      <p v-if="submitFailed" role="alert" class="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
        {{ t('post.saveFailed') }}
      </p>

      <button
        type="submit"
        :disabled="!canSubmit"
        class="w-full rounded bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-50"
      >
        <template v-if="submitting">
          {{ t('post.uploading', { done: progress.done, total: progress.total }) }}
        </template>
        <template v-else>{{ t('post.save') }}</template>
      </button>
    </form>
  </section>
</template>
