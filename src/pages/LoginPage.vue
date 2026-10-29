<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import LoginForm from '@/features/auth/components/LoginForm.vue'
import { homePathForRole } from '@/features/auth/guard'
import { useAuth } from '@/features/auth/useAuth'
import GateIllustration from '@/ui/atoms/GateIllustration.vue'
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
  <PageLayout>
    <div class="grid items-center gap-10 py-4 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-10">
      <section class="animate-fade-up">
        <p class="text-sm font-semibold uppercase tracking-[0.25em] text-brand-text">{{ t('login.eyebrow') }}</p>
        <h1 class="mt-3 text-4xl leading-[1.1] sm:text-5xl">{{ t('login.hero') }}</h1>
        <p class="mt-4 max-w-md text-lg text-ink-muted">{{ t('app.tagline') }}</p>
        <GateIllustration class="mt-8 hidden w-full max-w-md sm:block" />
      </section>

      <section class="animate-fade-up border border-line bg-surface p-6 shadow-2xl shadow-brand/10 [animation-delay:150ms] sm:p-8">
        <h2 class="text-xl font-bold uppercase tracking-wide">{{ t('login.title') }}</h2>
        <span aria-hidden="true" class="mt-3 block h-1 w-12 origin-left animate-grow-x bg-brand" />
        <div class="mt-6">
          <LoginForm :loading="loading" :failed="failed" @submit="onSubmit" />
        </div>
      </section>
    </div>
  </PageLayout>
</template>
