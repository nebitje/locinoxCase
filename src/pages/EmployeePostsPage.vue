<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import PostCard from '@/features/campaigns/components/PostCard.vue'
import { listCampaigns, type Campaign } from '@/features/campaigns/api'

const { t } = useI18n()

const campaigns = ref<Campaign[]>([])
const loading = ref(true)
const loadFailed = ref(false)

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

onMounted(load)
</script>

<template>
  <section class="mx-auto max-w-5xl px-4 py-8">
    <h1 class="text-2xl font-semibold">{{ t('employee.title') }}</h1>

    <p v-if="loading" role="status" class="mt-8 text-sm text-slate-500">{{ t('common.loading') }}</p>
    <div v-else-if="loadFailed" role="alert" class="mt-8 rounded bg-red-50 px-3 py-3 text-sm text-red-700">
      {{ t('employee.loadFailed') }}
      <button type="button" class="ml-2 underline" @click="load">{{ t('common.retry') }}</button>
    </div>
    <p v-else-if="campaigns.length === 0" class="mt-8 text-slate-600">{{ t('employee.empty') }}</p>

    <ul v-else class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <li v-for="campaign in campaigns" :key="campaign.id">
        <PostCard :campaign="campaign" class="h-full">
          <template #actions>
            <RouterLink
              :to="{ name: 'employee-post', params: { id: campaign.id } }"
              class="inline-block w-full rounded bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white"
            >
              {{ t('employee.open') }}
            </RouterLink>
          </template>
        </PostCard>
      </li>
    </ul>
  </section>
</template>
