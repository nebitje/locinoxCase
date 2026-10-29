<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { deleteCampaign, type Campaign } from '@/features/campaigns/api'
import PostCard from '@/features/campaigns/components/PostCard.vue'
import { useCampaignList } from '@/features/campaigns/useCampaignList'
import BaseAlert from '@/ui/atoms/BaseAlert.vue'
import BaseButton from '@/ui/atoms/BaseButton.vue'
import LoadingState from '@/ui/atoms/LoadingState.vue'
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
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-semibold">{{ t('admin.title') }}</h1>
      <BaseButton size="sm" to="/admin/posts/new">{{ t('admin.newPost') }}</BaseButton>
    </div>

    <BaseAlert v-if="justCreated" tone="success" class="mt-4">{{ t('admin.created') }}</BaseAlert>
    <BaseAlert v-if="deleteFailed" class="mt-4">{{ t('admin.deleteFailed') }}</BaseAlert>

    <LoadingState v-if="loading" class="mt-8">{{ t('common.loading') }}</LoadingState>
    <ErrorWithRetry
      v-else-if="loadFailed"
      class="mt-8"
      :message="t('admin.loadFailed')"
      :retry-label="t('common.retry')"
      @retry="load"
    />
    <p v-else-if="campaigns.length === 0" class="mt-8 text-slate-600">{{ t('admin.empty') }}</p>

    <ul v-else class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="campaign in campaigns" :key="campaign.id">
        <PostCard :campaign="campaign" class="h-full">
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
