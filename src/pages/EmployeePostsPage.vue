<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PostCard from '@/features/campaigns/components/PostCard.vue'
import { useCampaignList } from '@/features/campaigns/useCampaignList'
import BaseButton from '@/ui/atoms/BaseButton.vue'
import LoadingState from '@/ui/atoms/LoadingState.vue'
import ErrorWithRetry from '@/ui/molecules/ErrorWithRetry.vue'
import PageLayout from '@/ui/templates/PageLayout.vue'

const { t } = useI18n()

const { campaigns, loading, loadFailed, load } = useCampaignList()
</script>

<template>
  <PageLayout>
    <h1 class="text-2xl font-semibold">{{ t('employee.title') }}</h1>

    <LoadingState v-if="loading" class="mt-8">{{ t('common.loading') }}</LoadingState>
    <ErrorWithRetry
      v-else-if="loadFailed"
      class="mt-8"
      :message="t('employee.loadFailed')"
      :retry-label="t('common.retry')"
      @retry="load"
    />
    <p v-else-if="campaigns.length === 0" class="mt-8 text-ink-muted">{{ t('employee.empty') }}</p>

    <ul v-else class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="campaign in campaigns" :key="campaign.id">
        <PostCard :campaign="campaign" class="h-full">
          <template #actions>
            <BaseButton block size="sm" :to="{ name: 'employee-post', params: { id: campaign.id } }">
              {{ t('employee.open') }}
            </BaseButton>
          </template>
        </PostCard>
      </li>
    </ul>
  </PageLayout>
</template>
