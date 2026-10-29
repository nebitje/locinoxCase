import { buildOgHtml, isUuid, notFoundHtml, parseLanguage, pickOgCopy, type OgVariant } from './_og.js'

interface PostRow {
  title: string
  campaign_variants: OgVariant[]
  campaign_media: { kind: 'image' | 'video'; storage_path: string; position: number }[]
}

const HTML = { 'content-type': 'text/html; charset=utf-8' }

// Bereikbaar als /p/<id> (zie vercel.json). Leest met de service-role-sleutel, enkel op de server,
// omdat de tabellen niet publiek leesbaar zijn; het id is een willekeurige UUID.
export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')
  const language = parseLanguage(url.searchParams.get('lang'))
  const supabaseUrl = process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!isUuid(id)) return new Response(notFoundHtml(), { status: 404, headers: HTML })
  if (!supabaseUrl || !serviceKey) return new Response('Server not configured', { status: 500 })

  const query = `${supabaseUrl}/rest/v1/campaigns?id=eq.${id}&select=title,campaign_variants(language,variant_no,copy),campaign_media(kind,storage_path,position)`
  const response = await fetch(query, { headers: { apikey: serviceKey, authorization: `Bearer ${serviceKey}` } })
  if (!response.ok) return new Response('Upstream error', { status: 502 })

  const [row] = (await response.json()) as PostRow[]
  if (!row) return new Response(notFoundHtml(), { status: 404, headers: HTML })

  const first = [...row.campaign_media].sort((a, b) => a.position - b.position)[0]
  const imageUrl =
    first?.kind === 'image' ? `${supabaseUrl}/storage/v1/object/public/campaign-media/${first.storage_path}` : null

  const origin = url.origin
  const html = buildOgHtml(
    { title: row.title, copy: pickOgCopy(row.campaign_variants, language), imageUrl },
    `${origin}/p/${id}?lang=${language}`,
    `${origin}/posts/${id}`,
    language,
  )

  return new Response(html, {
    headers: { ...HTML, 'cache-control': 'public, s-maxage=60, stale-while-revalidate=600' },
  })
}
