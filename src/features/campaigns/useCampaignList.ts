import { onMounted, ref } from 'vue'
import { listCampaigns, type Campaign } from './api'

/** Laadt de posts met laad- en foutstatus; wordt gebruikt door de lijst van de admin en van de medewerker. */
export function useCampaignList() {
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

  return { campaigns, loading, loadFailed, load }
}
