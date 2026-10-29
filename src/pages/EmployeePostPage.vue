<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useAuth } from '@/features/auth/useAuth'
import { getCampaign, type Campaign } from '@/features/campaigns/api'
import PostMedia from '@/features/campaigns/components/PostMedia.vue'
import VariantSelector from '@/features/campaigns/components/VariantSelector.vue'
import { useVariantSelection } from '@/features/campaigns/useVariantSelection'
import ShareActions from '@/features/sharing/components/ShareActions.vue'
import { useSharePost } from '@/features/sharing/useSharePost'
import LoadingState from '@/ui/atoms/LoadingState.vue'
import BaseButton from '@/ui/atoms/BaseButton.vue'
import ErrorWithRetry from '@/ui/molecules/ErrorWithRetry.vue'
import PageLayout from '@/ui/templates/PageLayout.vue'

const { t } = useI18n()
const route = useRoute()
const { profile } = useAuth()

const campaign = ref<Campaign | null>(null)
const loading = ref(true)
const loadFailed = ref(false)

// De medewerker ziet standaard de eigen taal en kan wisselen naar elke taal waarin de post bestaat.
const { wantedLanguage, chosenVariantNo, languages, selection, selectedVariant, chooseLanguage } = useVariantSelection(
  campaign,
  profile.value?.preferredLanguage ?? 'en',
)
const { method, ready, preparing, busy, status, canCopyImage, isMobile, share, copyImage } = useSharePost(
  campaign,
  selectedVariant,
)

async function load() {
  loading.value = true
  loadFailed.value = false
  try {
    campaign.value = await getCampaign(String(route.params.id))
  } catch {
    loadFailed.value = true
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<template>
  <PageLayout>
    <BaseButton variant="link" to="/posts" class="text-ink-muted">{{ t('common.back') }}</BaseButton>

    <LoadingState v-if="loading" class="mt-6">{{ t('common.loading') }}</LoadingState>
    <ErrorWithRetry
      v-else-if="loadFailed"
      class="mt-6"
      :message="t('employee.loadFailed')"
      :retry-label="t('common.retry')"
      @retry="load"
    />
    <p v-else-if="!campaign" class="mt-6 text-ink-muted">{{ t('employee.notFound') }}</p>

    <article v-else class="mt-6 grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
      <PostMedia :campaign="campaign" class="animate-fade-up self-start lg:sticky lg:top-24" />

      <div class="animate-fade-up [animation-delay:120ms]">
        <p class="text-xs font-semibold uppercase tracking-[0.2em] text-brand-text">
          {{ t(`format.${campaign.format}`) }}
          <template v-if="campaign.format === 'carousel'"> · {{ campaign.media.length }}</template>
        </p>
        <h1 class="mt-2 text-3xl leading-tight">{{ campaign.title }}</h1>

        <VariantSelector
          v-model:variant-no="chosenVariantNo"
          :languages="languages"
          :selection="selection"
          :wanted-language="wantedLanguage"
          :selected="selectedVariant"
          @update:language="chooseLanguage"
        />

        <ShareActions
          :method="method"
          :format="campaign.format"
          :ready="ready"
          :preparing="preparing"
          :busy="busy"
          :is-mobile="isMobile"
          :can-copy-image="canCopyImage"
          :status="status"
          @share="share"
          @copy-image="copyImage"
        />
      </div>
    </article>
  </PageLayout>
</template>
