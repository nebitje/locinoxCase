<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { homePathForRole } from '@/features/auth/guard'
import LoginForm from '@/features/auth/components/LoginForm.vue'
import { useAuth } from '@/features/auth/useAuth'
import PageLayout from '@/ui/templates/PageLayout.vue'

const { t } = useI18n()
const router = useRouter()
const { signIn, role } = useAuth()

const loading = ref(false)
const failed = ref(false)

async function onSubmit(email: string, password: string) {
  loading.value = true
  failed.value = false
  const ok = await signIn(email, password)
  loading.value = false

  if (!ok || !role.value) {
    failed.value = true
    return
  }
  await router.replace(homePathForRole(role.value))
}
</script>

<template>
  <PageLayout width="narrow">
    <h1 class="text-2xl font-semibold">{{ t('login.title') }}</h1>
    <p class="mt-1 text-sm text-ink-muted">{{ t('app.tagline') }}</p>
    <div class="mt-6">
      <LoginForm :loading="loading" :failed="failed" @submit="onSubmit" />
    </div>
  </PageLayout>
</template>
