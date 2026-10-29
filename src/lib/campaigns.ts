import { supabase } from './supabase'
import { extensionFor, kindOf, type PostFormat } from './media-validation'

const BUCKET = 'campaign-media'

export interface CampaignMedia {
  kind: 'image' | 'video'
  url: string
  position: number
}

export interface Campaign {
  id: string
  title: string
  copy: string
  createdAt: string
  format: PostFormat
  media: CampaignMedia[]
}

export interface NewCampaign {
  title: string
  copy: string
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

interface CampaignRow {
  id: string
  title: string
  created_at: string
  campaign_variants: { language: string; variant_no: number; copy: string }[]
  campaign_media: { kind: 'image' | 'video'; storage_path: string; position: number }[]
}

function toCampaign(row: CampaignRow): Campaign {
  const media = [...row.campaign_media]
    .sort((a, b) => a.position - b.position)
    .map((item) => ({ kind: item.kind, url: publicUrl(item.storage_path), position: item.position }))
  const variant = [...row.campaign_variants].sort((a, b) => a.variant_no - b.variant_no)[0]

  return {
    id: row.id,
    title: row.title,
    copy: variant?.copy ?? '',
    createdAt: row.created_at,
    format: formatOf(media),
    media,
  }
}

export async function listCampaigns(): Promise<Campaign[]> {
  const { data, error } = await supabase
    .from('campaigns')
    .select(
      'id, title, created_at, campaign_variants(language, variant_no, copy), campaign_media(kind, storage_path, position)',
    )
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data as CampaignRow[]).map(toCampaign)
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

    const { error: variantError } = await supabase
      .from('campaign_variants')
      .insert({ campaign_id: campaignId, language: 'en', variant_no: 1, copy: input.copy })
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
