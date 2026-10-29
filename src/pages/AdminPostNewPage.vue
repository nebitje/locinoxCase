<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { createCampaign, type NewCampaign } from '@/features/campaigns/api'
import PostForm from '@/features/campaigns/components/PostForm.vue'
import { useAuth } from '@/features/auth/useAuth'
import BaseButton from '@/ui/atoms/BaseButton.vue'
import PageLayout from '@/ui/templates/PageLayout.vue'

const { t } = useI18n()
const router = useRouter()
const { profile } = useAuth()

const submitting = ref(false)
const progress = ref({ done: 0, total: 0 })
const failed = ref(false)

async function onSubmit(post: NewCampaign) {
  if (!profile.value) return

  submitting.value = true
  failed.value = false
  progress.value = { done: 0, total: post.files.length }
  try {
    await createCampaign(post, profile.value.id, (done, total) => (progress.value = { done, total }))
    await router.replace({ path: '/admin', query: { created: '1' } })
  } catch {
    failed.value = true
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <PageLayout width="medium">
    <BaseButton variant="link" to="/admin" class="text-ink-muted">{{ t('common.back') }}</BaseButton>
    <h1 class="mt-2 text-2xl font-semibold">{{ t('admin.newPost') }}</h1>
    <div class="mt-6">
      <PostForm :submitting="submitting" :progress="progress" :failed="failed" @submit="onSubmit" />
    </div>
  </PageLayout>
</template>
