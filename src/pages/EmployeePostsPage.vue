<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import PostCard from '@/features/campaigns/components/PostCard.vue'
import PostListSkeleton from '@/features/campaigns/components/PostListSkeleton.vue'
import { useCampaignList } from '@/features/campaigns/useCampaignList'
import BaseButton from '@/ui/atoms/BaseButton.vue'
import EmptyState from '@/ui/molecules/EmptyState.vue'
import ErrorWithRetry from '@/ui/molecules/ErrorWithRetry.vue'
import PageLayout from '@/ui/templates/PageLayout.vue'

const { t } = useI18n()

const { campaigns, loading, loadFailed, load } = useCampaignList()
</script>

<template>
  <PageLayout>
    <h1 class="animate-fade-up text-2xl sm:text-3xl">{{ t('employee.title') }}</h1>
    <span aria-hidden="true" class="mt-3 block h-1 w-16 origin-left animate-grow-x bg-brand" />

    <PostListSkeleton v-if="loading" class="mt-8" :label="t('common.loading')" />
    <ErrorWithRetry
      v-else-if="loadFailed"
      class="mt-8"
      :message="t('employee.loadFailed')"
      :retry-label="t('common.retry')"
      @retry="load"
    />
    <EmptyState v-else-if="campaigns.length === 0" :message="t('employee.empty')" />

    <ul v-else class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="(campaign, index) in campaigns" :key="campaign.id">
        <PostCard :campaign="campaign" :index="index" class="h-full">
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
