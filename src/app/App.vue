<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useAuth } from '@/features/auth/useAuth'
import LoadingState from '@/ui/atoms/LoadingState.vue'
import AppHeader from '@/ui/organisms/AppHeader.vue'

const { t } = useI18n()
const router = useRouter()
const { profile, ready, isAuthenticated, signOut } = useAuth()

async function onSignOut() {
  await signOut()
  await router.replace('/login')
}
</script>

<template>
  <AppHeader
    :app-name="t('app.name')"
    :user-name="isAuthenticated ? profile?.displayName : undefined"
    :sign-out-label="t('auth.signOut')"
    @sign-out="onSignOut"
  />
  <main>
    <LoadingState v-if="!ready" class="px-4 py-10 text-center">{{ t('common.loading') }}</LoadingState>
    <RouterView v-else />
  </main>
</template>
