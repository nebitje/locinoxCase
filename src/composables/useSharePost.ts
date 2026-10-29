import { computed, ref, watch, type Ref } from 'vue'
import { recordShare, type Campaign } from '../lib/campaigns'
import {
  choosePrimaryMethod,
  fileNameFor,
  isMobileDevice,
  linkedInShareUrl,
  publicPostUrl,
  resolvePublicOrigin,
  type ShareMethod,
} from '../lib/share'

/** Sleutels onder `share.status` in de vertalingen. */
export type ShareStatus =
  | 'nativeShared'
  | 'nativeSharedCopied'
  | 'linkedinOpenedCopied'
  | 'linkedinOpenedNotCopied'
  | 'imageCopied'
  | 'imageCopyFailed'
  | 'shareFailed'

export interface StatusMessage {
  key: ShareStatus
  tone: 'success' | 'error'
}

async function writeText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

async function toPngBlob(url: string): Promise<Blob> {
  const response = await fetch(url)
  const bitmap = await createImageBitmap(await response.blob())
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0)
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('png'))), 'image/png'),
  )
}

export function useSharePost(campaign: Ref<Campaign | null>) {
  const isMobile = isMobileDevice()
  const files = ref<File[]>([])
  const preparing = ref(false)
  const canShareFiles = ref(false)
  const busy = ref(false)
  const status = ref<StatusMessage | null>(null)

  const method = computed<ShareMethod>(() => choosePrimaryMethod({ canShareFiles: canShareFiles.value, isMobile }))
  /** Op mobiel wachten we met delen tot de bestanden klaarstaan, zodat de klik direct kan delen. */
  const ready = computed(() => !(isMobile && preparing.value))
  const canCopyImage = computed(
    () =>
      method.value === 'linkedin' &&
      campaign.value?.format === 'image' &&
      typeof ClipboardItem !== 'undefined' &&
      !!navigator.clipboard?.write,
  )

  // Bestanden worden vooraf opgehaald: het deelvenster moet binnen de klik zelf geopend worden
  // (Safari weigert anders), dus niet pas na een download. Op desktop is dit niet nodig.
  async function prepare() {
    if (!campaign.value || !isMobile || typeof navigator.canShare !== 'function') return
    preparing.value = true
    try {
      const { title, media } = campaign.value
      files.value = await Promise.all(
        media.map(async (item, index) => {
          const blob = await (await fetch(item.url)).blob()
          return new File([blob], fileNameFor(title, index, item.mimeType, media.length), { type: item.mimeType })
        }),
      )
      canShareFiles.value = navigator.canShare({ files: files.value })
    } catch {
      canShareFiles.value = false
    } finally {
      preparing.value = false
    }
  }

  function share() {
    const current = campaign.value
    if (!current || busy.value) return
    status.value = null
    if (method.value === 'native') void shareNative(current)
    else shareViaLinkedIn(current)
  }

  // Let op: geen `await` vóór window.open of navigator.share, anders gaat de klik als gebruikersactie verloren.
  function shareViaLinkedIn(current: Campaign) {
    const copied = writeText(current.copy)
    const origin = resolvePublicOrigin(import.meta.env.VITE_PUBLIC_URL, window.location.origin)
    window.open(linkedInShareUrl(publicPostUrl(origin, current.id)), '_blank', 'noopener')
    void copied.then((ok) => {
      status.value = { key: ok ? 'linkedinOpenedCopied' : 'linkedinOpenedNotCopied', tone: ok ? 'success' : 'error' }
    })
    void recordShare(current.id, 'linkedin')
  }

  async function shareNative(current: Campaign) {
    busy.value = true
    const copied = writeText(current.copy)
    try {
      await navigator.share({ files: files.value, text: current.copy, title: current.title })
      status.value = { key: (await copied) ? 'nativeSharedCopied' : 'nativeShared', tone: 'success' }
      void recordShare(current.id, 'native')
    } catch (error) {
      // AbortError: de gebruiker sloot het deelvenster zelf; dat is geen fout.
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        status.value = { key: 'shareFailed', tone: 'error' }
      }
    } finally {
      busy.value = false
    }
  }

  function copyImage() {
    const first = campaign.value?.media[0]
    if (!first) return
    const item = new ClipboardItem({ 'image/png': toPngBlob(first.url) })
    navigator.clipboard
      .write([item])
      .then(() => (status.value = { key: 'imageCopied', tone: 'success' }))
      .catch(() => (status.value = { key: 'imageCopyFailed', tone: 'error' }))
  }

  watch(() => campaign.value?.id, () => void prepare(), { immediate: true })

  return { method, ready, preparing, busy, status, canCopyImage, isMobile, share, copyImage }
}
