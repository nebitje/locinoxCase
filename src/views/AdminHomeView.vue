<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import PostCard from '../components/PostCard.vue'
import { deleteCampaign, listCampaigns, type Campaign } from '../lib/campaigns'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const campaigns = ref<Campaign[]>([])
const loading = ref(true)
const loadFailed = ref(false)
const deleteFailed = ref(false)
const deletingId = ref<string | null>(null)
const justCreated = ref(route.query.created === '1')

async function load() {
  loading.value = true
  loadFailed.value = false
  try {
    campaigns.value = await listCampaigns()
  } catch {
    loadFailed.value = true
  } finally {
    loading.value = false
  }
}

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

onMounted(async () => {
  if (justCreated.value) await router.replace({ query: {} })
  await load()
})
</script>

<template>
  <section class="mx-auto max-w-5xl px-4 py-8">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <h1 class="text-2xl font-semibold">{{ t('admin.title') }}</h1>
      <RouterLink
        to="/admin/posts/new"
        class="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      >
        {{ t('admin.newPost') }}
      </RouterLink>
    </div>

    <p v-if="justCreated" role="status" class="mt-4 rounded bg-green-50 px-3 py-2 text-sm text-green-800">
      {{ t('admin.created') }}
    </p>
    <p v-if="deleteFailed" role="alert" class="mt-4 rounded bg-red-50 px-3 py-2 text-sm text-red-700">
      {{ t('admin.deleteFailed') }}
    </p>

    <p v-if="loading" role="status" class="mt-8 text-sm text-slate-500">{{ t('common.loading') }}</p>
    <div v-else-if="loadFailed" role="alert" class="mt-8 rounded bg-red-50 px-3 py-3 text-sm text-red-700">
      {{ t('admin.loadFailed') }}
      <button type="button" class="ml-2 underline" @click="load">{{ t('common.retry') }}</button>
    </div>
    <p v-else-if="campaigns.length === 0" class="mt-8 text-slate-600">{{ t('admin.empty') }}</p>

    <ul v-else class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="campaign in campaigns" :key="campaign.id">
        <PostCard :campaign="campaign" class="h-full">
          <template #actions>
            <button
              type="button"
              :disabled="deletingId === campaign.id"
              class="text-sm text-red-700 underline disabled:opacity-50"
              @click="onDelete(campaign)"
            >
              {{ deletingId === campaign.id ? t('admin.deleting') : t('admin.delete') }}
            </button>
          </template>
        </PostCard>
      </li>
    </ul>
  </section>
</template>
