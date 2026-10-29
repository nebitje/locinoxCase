import { computed, ref, type Ref } from 'vue'
import type { AppLocale } from '@/shared/i18n/locales'
import type { Campaign } from './api'
import { availableLanguages, pickVariants } from './variants'

/**
 * Welke taal en variant van een post de medewerker bekijkt en deelt.
 * Start in de taal van het profiel; ontbreekt die, dan valt `pickVariants` terug op het Engels.
 */
export function useVariantSelection(campaign: Ref<Campaign | null>, preferredLanguage: AppLocale) {
  const wantedLanguage = ref<AppLocale>(preferredLanguage)
  const chosenVariantNo = ref(1)

  const languages = computed(() => availableLanguages(campaign.value?.variants ?? []))
  const selection = computed(() => pickVariants(campaign.value?.variants ?? [], wantedLanguage.value))
  const selectedVariant = computed(
    () =>
      selection.value.variants.find((item) => item.variantNo === chosenVariantNo.value) ??
      selection.value.variants[0] ??
      null,
  )

  function chooseLanguage(language: AppLocale) {
    wantedLanguage.value = language
    chosenVariantNo.value = 1
  }

  return { wantedLanguage, chosenVariantNo, languages, selection, selectedVariant, chooseLanguage }
}
