<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useAuth } from '../composables/useAuth'
import { useSharePost } from '../composables/useSharePost'
import type { AppLocale } from '../i18n/locales'
import { getCampaign, type Campaign } from '../lib/campaigns'
import { availableLanguages, pickVariants } from '../lib/variants'

const { t } = useI18n()
const route = useRoute()

const campaign = ref<Campaign | null>(null)
const loading = ref(true)
const notFound = ref(false)
const loadFailed = ref(false)

const { profile } = useAuth()

// De medewerker ziet standaard de eigen taal en kan wisselen naar elke taal waarin de post bestaat.
const wantedLanguage = ref<AppLocale>(profile.value?.preferredLanguage ?? 'en')
const chosenVariantNo = ref(1)

const languages = computed(() => availableLanguages(campaign.value?.variants ?? []))
const selection = computed(() => pickVariants(campaign.value?.variants ?? [], wantedLanguage.value))
const selectedVariant = computed(
  () => selection.value.variants.find((item) => item.variantNo === chosenVariantNo.value) ?? selection.value.variants[0] ?? null,
)

function chooseLanguage(language: AppLocale) {
  wantedLanguage.value = language
  chosenVariantNo.value = 1
}

const { method, ready, preparing, busy, status, canCopyImage, isMobile, share, copyImage } = useSharePost(campaign, selectedVariant)

async function load() {
  loading.value = true
  loadFailed.value = false
  try {
    campaign.value = await getCampaign(String(route.params.id))
    notFound.value = campaign.value === null
  } catch {
    loadFailed.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <section class="mx-auto max-w-2xl px-4 py-6">
    <RouterLink to="/posts" class="text-sm text-slate-600 underline">{{ t('common.back') }}</RouterLink>

    <p v-if="loading" role="status" class="mt-6 text-sm text-slate-500">{{ t('common.loading') }}</p>
    <div v-else-if="loadFailed" role="alert" class="mt-6 rounded bg-red-50 px-3 py-3 text-sm text-red-700">
      {{ t('employee.loadFailed') }}
      <button type="button" class="ml-2 underline" @click="load">{{ t('common.retry') }}</button>
    </div>
    <p v-else-if="notFound || !campaign" class="mt-6 text-slate-600">{{ t('employee.notFound') }}</p>

    <article v-else class="mt-4">
      <div v-if="campaign.format === 'carousel'" class="flex snap-x snap-mandatory gap-2 overflow-x-auto rounded-lg">
        <img
          v-for="(item, index) in campaign.media"
          :key="item.url"
          :src="item.url"
          :alt="`${campaign.title} (${index + 1}/${campaign.media.length})`"
          class="aspect-square w-full shrink-0 snap-center rounded-lg bg-slate-100 object-cover"
        >
      </div>
      <video
        v-else-if="campaign.media[0]?.kind === 'video'"
        :src="campaign.media[0].url"
        class="w-full rounded-lg bg-black"
        controls
        playsinline
        preload="metadata"
      />
      <img
        v-else-if="campaign.media[0]"
        :src="campaign.media[0].url"
        :alt="campaign.title"
        class="w-full rounded-lg bg-slate-100"
      >

      <p class="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
        {{ t(`format.${campaign.format}`) }}
        <template v-if="campaign.format === 'carousel'"> · {{ campaign.media.length }}</template>
      </p>
      <h1 class="mt-1 text-2xl font-semibold">{{ campaign.title }}</h1>
      <div v-if="languages.length > 1" class="mt-4 flex flex-wrap items-center gap-2 text-sm" role="group" :aria-label="t('employee.postLanguage')">
        <span class="text-slate-600">{{ t('employee.postLanguage') }}</span>
        <button
          v-for="language in languages"
          :key="language"
          type="button"
          :aria-pressed="selection.language === language"
          :class="selection.language === language ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white'"
          class="rounded border px-3 py-1"
          @click="chooseLanguage(language)"
        >
          {{ language.toUpperCase() }}
        </button>
      </div>
      <p v-if="selection.fellBack && selection.variants.length > 0" class="mt-2 rounded bg-amber-50 px-3 py-2 text-sm text-amber-800">
        {{ t('employee.fallbackNote', { wanted: t(`language.${wantedLanguage}`), shown: t(`language.${selection.language}`) }) }}
      </p>

      <fieldset v-if="selection.variants.length > 1" class="mt-3 space-y-2">
        <legend class="text-sm text-slate-600">{{ t('employee.chooseVariant') }}</legend>
        <label
          v-for="item in selection.variants"
          :key="item.variantNo"
          :class="selectedVariant?.variantNo === item.variantNo ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-300'"
          class="flex cursor-pointer gap-3 rounded border bg-white p-3"
        >
          <input v-model="chosenVariantNo" type="radio" name="variant" :value="item.variantNo" class="mt-1">
          <span>
            <span class="block text-xs font-medium text-slate-500">{{ t('employee.variant', { n: item.variantNo }) }}</span>
            <span class="block whitespace-pre-line text-slate-700">{{ item.copy }}</span>
          </span>
        </label>
      </fieldset>
      <p v-else class="mt-3 whitespace-pre-line text-slate-700">{{ selectedVariant?.copy }}</p>

      <div class="mt-6 space-y-3">
        <button
          type="button"
          :disabled="!ready || busy"
          class="w-full rounded bg-slate-900 px-4 py-3 text-base font-medium text-white disabled:opacity-60"
          @click="share"
        >
          <template v-if="!ready">{{ t('share.preparing') }}</template>
          <template v-else-if="busy">{{ t('share.sharing') }}</template>
          <template v-else>{{ method === 'native' ? t('share.button.native') : t('share.button.linkedin') }}</template>
        </button>

        <button
          v-if="canCopyImage"
          type="button"
          class="w-full rounded border border-slate-300 bg-white px-4 py-2 text-sm"
          @click="copyImage"
        >
          {{ t('share.copyImage') }}
        </button>

        <p
          v-if="status"
          :role="status.tone === 'error' ? 'alert' : 'status'"
          :class="status.tone === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-800'"
          class="rounded px-3 py-2 text-sm"
        >
          {{ t(`share.status.${status.key}`) }}
        </p>

        <p v-if="method === 'native'" class="text-xs text-slate-500">{{ t('share.hint.native') }}</p>
        <p v-else-if="!preparing" class="text-xs text-slate-500">
          {{ campaign.format === 'image' ? t('share.hint.linkedinImage') : t('share.hint.linkedinMedia') }}
          <template v-if="!isMobile"> {{ t('share.hint.desktopPhone') }}</template>
        </p>
      </div>
    </article>
  </section>
</template>
