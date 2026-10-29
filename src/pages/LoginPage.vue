<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuth } from '@/features/auth/useAuth'
import { homePathForRole } from '@/app/router/guard'

const { t } = useI18n()
const router = useRouter()
const { signIn, role } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const failed = ref(false)

async function onSubmit() {
  loading.value = true
  failed.value = false
  const ok = await signIn(email.value.trim(), password.value)
  loading.value = false

  if (!ok || !role.value) {
    failed.value = true
    return
  }
  await router.replace(homePathForRole(role.value))
}
</script>

<template>
  <section class="mx-auto max-w-sm px-4 py-12">
    <h1 class="text-2xl font-semibold">{{ t('login.title') }}</h1>
    <p class="mt-1 text-sm text-slate-600">{{ t('app.tagline') }}</p>

    <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
      <label class="block text-sm">
        <span class="font-medium">{{ t('login.email') }}</span>
        <input
          v-model="email"
          type="email"
          required
          autocomplete="username"
          class="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2"
        >
      </label>
      <label class="block text-sm">
        <span class="font-medium">{{ t('login.password') }}</span>
        <input
          v-model="password"
          type="password"
          required
          autocomplete="current-password"
          class="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2"
        >
      </label>

      <p v-if="failed" role="alert" class="rounded bg-red-50 px-3 py-2 text-sm text-red-700">
        {{ t('login.failed') }}
      </p>

      <button
        type="submit"
        :disabled="loading"
        class="w-full rounded bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-60"
      >
        {{ loading ? t('login.loading') : t('login.submit') }}
      </button>
    </form>
  </section>
</template>
