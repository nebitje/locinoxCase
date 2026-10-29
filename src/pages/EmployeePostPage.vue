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
  <PageLayout width="medium">
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

    <article v-else class="mt-4">
      <PostMedia :campaign="campaign" />

      <p class="mt-3 text-xs font-medium uppercase tracking-wide text-ink-subtle">
        {{ t(`format.${campaign.format}`) }}
        <template v-if="campaign.format === 'carousel'"> · {{ campaign.media.length }}</template>
      </p>
      <h1 class="mt-1 text-2xl font-semibold">{{ campaign.title }}</h1>

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
    </article>
  </PageLayout>
</template>
