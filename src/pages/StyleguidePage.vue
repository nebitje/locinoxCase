<script setup lang="ts">
// Ontwikkelaarspagina (/styleguide): toont de design tokens en bouwstenen op voorbeelddata, zonder login.
// De labels zijn bewust enkel Engels; dit is documentatie voor ontwikkelaars en ontwerpers.
import { computed, ref } from 'vue'
import { publicUrl, type Campaign } from '@/features/campaigns/api'
import PostCard from '@/features/campaigns/components/PostCard.vue'
import PostListSkeleton from '@/features/campaigns/components/PostListSkeleton.vue'
import PostMedia from '@/features/campaigns/components/PostMedia.vue'
import BaseAlert from '@/ui/atoms/BaseAlert.vue'
import BaseBadge from '@/ui/atoms/BaseBadge.vue'
import BaseButton from '@/ui/atoms/BaseButton.vue'
import BaseInput from '@/ui/atoms/BaseInput.vue'
import GateIllustration from '@/ui/atoms/GateIllustration.vue'
import EmptyState from '@/ui/molecules/EmptyState.vue'
import FormField from '@/ui/molecules/FormField.vue'
import SegmentedControl from '@/ui/molecules/SegmentedControl.vue'
import PageLayout from '@/ui/templates/PageLayout.vue'

const demoPath = (post: string, index: number, photo: string) =>
  publicUrl(`00000000-0000-4000-8000-00000000d00${post}/${index}-demo-${photo}.jpg`)

const image = (url: string, position: number) => ({ kind: 'image' as const, url, mimeType: 'image/jpeg', position })

const single: Campaign = {
  id: 'demo-1',
  title: 'Secure by design',
  createdAt: '',
  format: 'image',
  media: [image(demoPath('1', 0, '8yYAaguVDgY'), 0)],
  variants: [{ language: 'en', variantNo: 1, copy: 'A good gate does not shout about security. It simply works, every day, in every weather.' }],
}

const carousel: Campaign = {
  id: 'demo-4',
  title: 'Gates around the world',
  createdAt: '',
  format: 'carousel',
  media: [
    image(demoPath('4', 0, '3pagydwiHC4'), 0),
    image(demoPath('4', 1, 'WTreUo2YFGw'), 1),
    image(demoPath('4', 2, 'eAdq5k2-YoI'), 2),
  ],
  variants: [{ language: 'en', variantNo: 1, copy: 'Black steel, green steel, a simple fence: every gate tells its own story.' }],
}

const swatches = [
  { token: 'brand', label: 'Brand', note: '#FF5000' },
  { token: 'brand-text', label: 'Brand text', note: 'on light' },
  { token: 'ink', label: 'Ink', note: 'text' },
  { token: 'ink-muted', label: 'Ink muted', note: 'secondary' },
  { token: 'line', label: 'Line', note: 'borders' },
  { token: 'surface', label: 'Surface', note: 'cards' },
  { token: 'surface-muted', label: 'Surface muted', note: 'placeholders' },
  { token: 'page', label: 'Page', note: 'background' },
]

const tab = ref('en')
const tabs = computed(() => ['en', 'fr', 'de', 'nl'].map((code) => ({ value: code, label: code.toUpperCase(), mark: code === 'en' ? '✓' : undefined })))
const toggle = ref('fr')
const text = ref('')
</script>

<template>
  <PageLayout>
    <p class="text-sm font-semibold uppercase tracking-[0.25em] text-brand-text">Design system</p>
    <h1 class="mt-2 animate-fade-up text-4xl sm:text-5xl">Styleguide</h1>
    <p class="mt-3 max-w-2xl text-lg text-ink-muted">
      The tokens and building blocks of the app, shown with sample data. Toggle the theme in the header to check both modes.
    </p>

    <section class="mt-12">
      <h2 class="text-xl font-bold uppercase tracking-wide">Colour tokens</h2>
      <ul class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <li v-for="(swatch, i) in swatches" :key="swatch.token" class="animate-fade-up border border-line bg-surface [animation-delay:calc(var(--i)*50ms)]" :style="{ '--i': i }">
          <div class="h-16 border-b border-line" :style="{ background: `var(--${swatch.token})` }" />
          <div class="p-3">
            <p class="text-sm font-semibold">{{ swatch.label }}</p>
            <p class="text-xs text-ink-subtle">{{ swatch.note }}</p>
          </div>
        </li>
      </ul>
    </section>

    <section class="mt-12">
      <h2 class="text-xl font-bold uppercase tracking-wide">Typography</h2>
      <div class="mt-4 space-y-2 border border-line bg-surface p-6">
        <p class="text-5xl font-bold uppercase leading-tight tracking-wide">Heading one</p>
        <p class="text-2xl font-semibold">Subheading in sentence case</p>
        <p class="text-ink">Body text in Open Sans. Gate hardware and access control for professionals.</p>
        <p class="text-sm text-ink-muted">Secondary text for hints and descriptions.</p>
      </div>
    </section>

    <section class="mt-12">
      <h2 class="text-xl font-bold uppercase tracking-wide">Buttons</h2>
      <div class="mt-4 flex flex-wrap items-center gap-4 border border-line bg-surface p-6">
        <BaseButton size="lg">Primary large</BaseButton>
        <BaseButton>Primary</BaseButton>
        <BaseButton size="sm" disabled>Disabled</BaseButton>
        <BaseButton variant="secondary">Secondary</BaseButton>
        <BaseButton variant="link">Link</BaseButton>
        <BaseButton variant="danger-link">Danger link</BaseButton>
      </div>
    </section>

    <section class="mt-12">
      <h2 class="text-xl font-bold uppercase tracking-wide">Form elements</h2>
      <div class="mt-4 grid gap-6 border border-line bg-surface p-6 sm:grid-cols-2">
        <FormField label="Text field" hint="With a hint below the label">
          <BaseInput v-model="text" placeholder="Type something…" />
        </FormField>
        <div class="space-y-4">
          <div>
            <p class="mb-2 text-sm font-medium">Tabs (language)</p>
            <SegmentedControl v-model="tab" mode="tabs" :options="tabs" />
          </div>
          <div>
            <p class="mb-2 text-sm font-medium">Toggle group</p>
            <SegmentedControl v-model="toggle" :options="tabs" />
          </div>
        </div>
      </div>
    </section>

    <section class="mt-12">
      <h2 class="text-xl font-bold uppercase tracking-wide">Feedback</h2>
      <div class="mt-4 space-y-3 border border-line bg-surface p-6">
        <BaseAlert tone="success">Post created.</BaseAlert>
        <BaseAlert tone="warning">This post has no version in Dutch. Showing English.</BaseAlert>
        <BaseAlert>The post could not be saved. Nothing was created, please try again.</BaseAlert>
        <p><BaseBadge>Carousel · 3</BaseBadge></p>
      </div>
    </section>

    <section class="mt-12">
      <h2 class="text-xl font-bold uppercase tracking-wide">Post cards (hover them)</h2>
      <ul class="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <li><PostCard :campaign="single" :index="0" class="h-full"><template #actions><BaseButton block size="sm">Open and share</BaseButton></template></PostCard></li>
        <li><PostCard :campaign="carousel" :index="1" class="h-full"><template #actions><BaseButton block size="sm">Open and share</BaseButton></template></PostCard></li>
      </ul>
    </section>

    <section class="mt-12 grid gap-8 lg:grid-cols-2">
      <div>
        <h2 class="text-xl font-bold uppercase tracking-wide">Carousel</h2>
        <PostMedia :campaign="carousel" class="mt-4" />
      </div>
      <div>
        <h2 class="text-xl font-bold uppercase tracking-wide">Brand illustration</h2>
        <GateIllustration class="mt-4 w-full" />
      </div>
    </section>

    <section class="mt-12">
      <h2 class="text-xl font-bold uppercase tracking-wide">Loading and empty states</h2>
      <PostListSkeleton class="mt-4" label="Loading…" />
      <EmptyState message="No posts available yet." />
    </section>
  </PageLayout>
</template>
