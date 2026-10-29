export type ShareMethod = 'native' | 'linkedin'

export interface ShareEnvironment {
  /** navigator.canShare({ files }) is waar voor de voorbereide bestanden. */
  canShareFiles: boolean
  /** Telefoon of tablet met aanraakscherm. */
  isMobile: boolean
}

/**
 * Op mobiel opent het deelvenster van het toestel mét de bestanden (één tik, daarna de app kiezen).
 * Op desktop bevat dat venster meestal geen LinkedIn, dus openen we LinkedIn zelf met de link naar de post
 * en zetten we de tekst op het klembord.
 */
export function choosePrimaryMethod({ canShareFiles, isMobile }: ShareEnvironment): ShareMethod {
  return isMobile && canShareFiles ? 'native' : 'linkedin'
}

/**
 * Het adres waarmee gedeeld wordt. Een vast publiek adres (VITE_PUBLIC_URL) voorkomt dat de link naar een
 * beschermde preview- of deployment-URL wijst, die LinkedIn niet kan ophalen. Zonder instelling of bij een
 * ongeldige waarde gebruiken we het adres van de huidige pagina.
 */
export function resolvePublicOrigin(configured: string | undefined, currentOrigin: string): string {
  const value = configured?.trim()
  if (!value) return currentOrigin
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.origin : currentOrigin
  } catch {
    return currentOrigin
  }
}

/** De publieke pagina met Open Graph-tags waar LinkedIn de preview vandaan haalt. */
export function publicPostUrl(origin: string, campaignId: string): string {
  return `${origin}/p/${campaignId}`
}

/** LinkedIn accepteert in deze URL enkel de link; titel, tekst en beeld komen uit de Open Graph-tags. */
export function linkedInShareUrl(postUrl: string): string {
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`
}

export function fileNameFor(title: string, index: number, mimeType: string, total: number): string {
  const base =
    title
      .normalize('NFKD')
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .toLowerCase()
      .slice(0, 40) || 'post'
  const extension = mimeType.split('/')[1]?.replace('quicktime', 'mov') ?? 'bin'
  return total > 1 ? `${base}-${index + 1}.${extension}` : `${base}.${extension}`
}

export function isMobileDevice(): boolean {
  const uaData = (navigator as Navigator & { userAgentData?: { mobile?: boolean } }).userAgentData
  if (typeof uaData?.mobile === 'boolean') return uaData.mobile
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(navigator.userAgent))
}
