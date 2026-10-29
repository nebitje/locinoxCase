import { supabase } from '@/shared/supabase'
import { isAppLocale } from '@/shared/i18n/locales'
import { extensionFor, kindOf, type PostFormat } from './media-validation'
import type { Variant } from './variants'

const BUCKET = 'campaign-media'

export interface CampaignMedia {
  kind: 'image' | 'video'
  url: string
  mimeType: string
  position: number
}

export interface Campaign {
  id: string
  title: string
  /** Alle teksten, in alle talen en varianten. */
  variants: Variant[]
  createdAt: string
  format: PostFormat
  media: CampaignMedia[]
}

export interface NewCampaign {
  title: string
  variants: Variant[]
  /** In de gewenste volgorde. */
  files: File[]
}

export function publicUrl(path: string): string {
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

function formatOf(media: CampaignMedia[]): PostFormat {
  if (media[0]?.kind === 'video') return 'video'
  return media.length > 1 ? 'carousel' : 'image'
}

const CAMPAIGN_SELECT =
  'id, title, created_at, campaign_variants(language, variant_no, copy), campaign_media(kind, storage_path, mime_type, position)'

interface CampaignRow {
  id: string
  title: string
  created_at: string
  campaign_variants: { language: string; variant_no: number; copy: string }[]
  campaign_media: { kind: 'image' | 'video'; storage_path: string; mime_type: string; position: number }[]
}

function toCampaign(row: CampaignRow): Campaign {
  const media = [...row.campaign_media]
    .sort((a, b) => a.position - b.position)
    .map((item) => ({
      kind: item.kind,
      url: publicUrl(item.storage_path),
      mimeType: item.mime_type,
      position: item.position,
    }))
  const variants = row.campaign_variants.flatMap((item) =>
    isAppLocale(item.language) ? [{ language: item.language, variantNo: item.variant_no, copy: item.copy }] : [],
  )

  return {
    id: row.id,
    title: row.title,
    variants,
    createdAt: row.created_at,
    format: formatOf(media),
    media,
  }
}

export async function listCampaigns(): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from('campaigns')
    .select(CAMPAIGN_SELECT)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as CampaignRow[]).map(toCampaign)
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const { data, error } = await supabase.from('campaigns').select(CAMPAIGN_SELECT).eq('id', id).maybeSingle()
  if (error) throw error
  return data ? toCampaign(data as CampaignRow) : null
}

/** Registreert een share; mislukt dit, dan blokkeert dat het delen niet. */
export async function recordShare(
  campaignId: string,
  method: 'native' | 'linkedin',
  variant: Pick<Variant, 'language' | 'variantNo'> | null,
): Promise<void> {
  await supabase.from('shares').insert({
    campaign_id: campaignId,
    method,
    language: variant?.language ?? null,
    variant_no: variant?.variantNo ?? null,
  })
}

/**
 * Maakt een campagne aan: bestanden uploaden, dan de rijen opslaan.
 * Bij een fout worden de al geüploade bestanden en de campagne weer verwijderd.
 */
export async function createCampaign(
  input: NewCampaign,
  userId: string,
  onProgress?: (done: number, total: number) => void,
): Promise<string> {
  const campaignId = crypto.randomUUID()
  const uploaded: { path: string; file: File }[] = []

  try {
    for (const [index, file] of input.files.entries()) {
      const path = `${campaignId}/${index}-${crypto.randomUUID()}.${extensionFor(file.type)}`
      const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: file.type,
        cacheControl: '31536000',
      })
      if (error) throw error
      uploaded.push({ path, file })
      onProgress?.(index + 1, input.files.length)
    }

    const { error: campaignError } = await supabase
      .from('campaigns')
      .insert({ id: campaignId, title: input.title, created_by: userId })
    if (campaignError) throw campaignError

    const { error: variantError } = await supabase.from('campaign_variants').insert(
      input.variants.map((variant) => ({
        campaign_id: campaignId,
        language: variant.language,
        variant_no: variant.variantNo,
        copy: variant.copy,
      })),
    )
    if (variantError) throw variantError

    const { error: mediaError } = await supabase.from('campaign_media').insert(
      uploaded.map(({ path, file }, position) => ({
        campaign_id: campaignId,
        kind: kindOf(file),
        storage_path: path,
        mime_type: file.type,
        size_bytes: file.size,
        position,
      })),
    )
    if (mediaError) throw mediaError

    return campaignId
  } catch (error) {
    // Opruimen is best effort; de oorspronkelijke fout blijft de belangrijkste.
    await supabase.from('campaigns').delete().eq('id', campaignId)
    if (uploaded.length > 0) await supabase.storage.from(BUCKET).remove(uploaded.map((item) => item.path))
    throw error
  }
}

export async function deleteCampaign(id: string): Promise<void> {
  const { data: media, error: mediaError } = await supabase
    .from('campaign_media')
    .select('storage_path')
    .eq('campaign_id', id)
  if (mediaError) throw mediaError

  const { error } = await supabase.from('campaigns').delete().eq('id', id)
  if (error) throw error

  if (media.length > 0) {
    await supabase.storage.from(BUCKET).remove(media.map((item) => item.storage_path))
  }
}
