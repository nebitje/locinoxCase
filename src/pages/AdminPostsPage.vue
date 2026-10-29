<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { deleteCampaign, type Campaign } from '@/features/campaigns/api'
import PostCard from '@/features/campaigns/components/PostCard.vue'
import PostListSkeleton from '@/features/campaigns/components/PostListSkeleton.vue'
import { useCampaignList } from '@/features/campaigns/useCampaignList'
import BaseAlert from '@/ui/atoms/BaseAlert.vue'
import BaseButton from '@/ui/atoms/BaseButton.vue'
import EmptyState from '@/ui/molecules/EmptyState.vue'
import ErrorWithRetry from '@/ui/molecules/ErrorWithRetry.vue'
import PageLayout from '@/ui/templates/PageLayout.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const { campaigns, loading, loadFailed, load } = useCampaignList()

const deleteFailed = ref(false)
const deletingId = ref<string | null>(null)
const justCreated = ref(route.query.created === '1')

async function onDelete(campaign: Campaign) {
  if (!window.confirm(t('admin.confirmDelete', { title: campaign.title }))) return
  deletingId.value = campaign.id
  deleteFailed.value = false
  try {
    await deleteCampaign(campaign.id)
    campaigns.value = campaigns.value.filter((item) => item.id !== campaign.id)
  } catch {
    deleteFailed.value = true
  } finally {
    deletingId.value = null
  }
}

// De "aangemaakt"-melding komt uit de URL; die halen we weg zodat ze niet terugkomt bij verversen.
onMounted(() => {
  if (justCreated.value) void router.replace({ query: {} })
})
</script>

<template>
  <PageLayout>
    <div class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="animate-fade-up text-2xl sm:text-3xl">{{ t('admin.title') }}</h1>
        <span aria-hidden="true" class="mt-3 block h-1 w-16 origin-left animate-grow-x bg-brand" />
      </div>
      <BaseButton size="sm" to="/admin/posts/new">{{ t('admin.newPost') }}</BaseButton>
    </div>

    <BaseAlert v-if="justCreated" tone="success" class="mt-4">{{ t('admin.created') }}</BaseAlert>
    <BaseAlert v-if="deleteFailed" class="mt-4">{{ t('admin.deleteFailed') }}</BaseAlert>

    <PostListSkeleton v-if="loading" class="mt-8" :label="t('common.loading')" />
    <ErrorWithRetry
      v-else-if="loadFailed"
      class="mt-8"
      :message="t('admin.loadFailed')"
      :retry-label="t('common.retry')"
      @retry="load"
    />
    <EmptyState v-else-if="campaigns.length === 0" :message="t('admin.empty')" />

    <ul v-else class="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="(campaign, index) in campaigns" :key="campaign.id">
        <PostCard :campaign="campaign" :index="index" class="h-full">
          <template #actions>
            <BaseButton variant="danger-link" :disabled="deletingId === campaign.id" @click="onDelete(campaign)">
              {{ deletingId === campaign.id ? t('admin.deleting') : t('admin.delete') }}
            </BaseButton>
          </template>
        </PostCard>
      </li>
    </ul>
  </PageLayout>
</template>
