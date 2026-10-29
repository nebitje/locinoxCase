import { buildOgHtml, isUuid, notFoundHtml } from './_og.js'

interface PostRow {
  title: string
  campaign_variants: { language: string; variant_no: number; copy: string }[]
  campaign_media: { kind: 'image' | 'video'; storage_path: string; position: number }[]
}

const HTML = { 'content-type': 'text/html; charset=utf-8' }

// Bereikbaar als /p/<id> (zie vercel.json). Leest met de service-role-sleutel, enkel op de server,
// omdat de tabellen niet publiek leesbaar zijn; het id is een willekeurige UUID.
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!isUuid(id)) return new Response(notFoundHtml(), { status: 404, headers: HTML })
  if (!supabaseUrl || !serviceKey) return new Response('Server not configured', { status: 500 })

  const query = `${supabaseUrl}/rest/v1/campaigns?id=eq.${id}&select=title,campaign_variants(language,variant_no,copy),campaign_media(kind,storage_path,position)`
  const response = await fetch(query, { headers: { apikey: serviceKey, authorization: `Bearer ${serviceKey}` } })
  if (!response.ok) return new Response('Upstream error', { status: 502 })

  const [row] = (await response.json()) as PostRow[]
  if (!row) return new Response(notFoundHtml(), { status: 404, headers: HTML })

  const variant = [...row.campaign_variants].sort((a, b) => a.variant_no - b.variant_no)[0]
  const first = [...row.campaign_media].sort((a, b) => a.position - b.position)[0]
  const imageUrl =
    first?.kind === 'image' ? `${supabaseUrl}/storage/v1/object/public/campaign-media/${first.storage_path}` : null

  const origin = url.origin
  const html = buildOgHtml(
    { title: row.title, copy: variant?.copy ?? '', imageUrl },
    `${origin}/p/${id}`,
    `${origin}/posts/${id}`,
  )

  return new Response(html, {
    headers: { ...HTML, 'cache-control': 'public, s-maxage=60, stale-while-revalidate=600' },
  })
}
