// Zet demoposts met rechtenvrije foto's in Supabase. Gebruik: npm run seed:demo
// Opnieuw uitvoeren mag: de demoposts hebben vaste id's en worden telkens vervangen.
import { createClient } from '@supabase/supabase-js'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'
// media-validation.ts mag geen alias-imports bevatten: Node leest dit bestand rechtstreeks.
import { validateMedia } from '../src/features/campaigns/media-validation.ts'
import { demoPosts, type DemoLanguage } from './demo-posts.ts'

const ASSET_DIR = join(import.meta.dirname, 'demo-assets')
const BUCKET = 'campaign-media'
const MIME: Record<string, string> = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Ontbrekende omgevingsvariabele: ${name}`)
  return value
}

const supabase = createClient(requireEnv('VITE_SUPABASE_URL'), requireEnv('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { persistSession: false, autoRefreshToken: false },
})

/** Unsplash geeft gedownloade bestanden de naam "<fotograaf>-<foto-id>-unsplash.jpg"; we zoeken op het foto-id. */
function findAsset(photoId: string): string | undefined {
  return readdirSync(ASSET_DIR).find((name) => name.includes(photoId) && extname(name).toLowerCase() in MIME)
}

// 1. Controleer vooraf of alle foto's aanwezig en geldig zijn.
const wanted = [...new Set(demoPosts.flatMap((post) => post.photos))]
const missing = wanted.filter((id) => !findAsset(id))
if (missing.length > 0) {
  console.error(`Ontbrekende foto's in scripts/demo-assets/ (foto-id staat in de bestandsnaam):\n- ${missing.join('\n- ')}`)
  process.exit(1)
}

for (const post of demoPosts) {
  const files = post.photos.map((id) => {
    const name = findAsset(id)!
    const path = join(ASSET_DIR, name)
    return { name, path, type: MIME[extname(name).toLowerCase()]!, size: statSync(path).size }
  })
  const check = validateMedia(files)
  if (!check.ok) throw new Error(`"${post.title}": ongeldige media (${check.error} ${check.fileName ?? ''}). Kies bij het downloaden een kleinere versie (Medium).`)
  for (const language of ['en', 'fr', 'de'] as DemoLanguage[]) {
    if (post.copy[language].length === 0) throw new Error(`"${post.title}": tekst in ${language} ontbreekt.`)
  }
}

// 2. De admin die de posts "aanmaakt".
const { data: admin, error: adminError } = await supabase.from('profiles').select('id').eq('role', 'admin').limit(1).single()
if (adminError || !admin) throw new Error('Geen admin gevonden. Voer eerst npm run seed uit.')

// 3. Elke demopost vervangen.
for (const [index, post] of demoPosts.entries()) {
  const { data: existing } = await supabase.storage.from(BUCKET).list(post.id)
  if (existing && existing.length > 0) {
    await supabase.storage.from(BUCKET).remove(existing.map((file) => `${post.id}/${file.name}`))
  }
  await supabase.from('campaigns').delete().eq('id', post.id)

  const uploaded = []
  for (const [position, photoId] of post.photos.entries()) {
    const name = findAsset(photoId)!
    const type = MIME[extname(name).toLowerCase()]!
    const body = readFileSync(join(ASSET_DIR, name))
    const storagePath = `${post.id}/${position}-demo-${photoId}${extname(name).toLowerCase()}`
    const { error } = await supabase.storage.from(BUCKET).upload(storagePath, body, { contentType: type, upsert: true, cacheControl: '31536000' })
    if (error) throw error
    uploaded.push({ storagePath, type, size: body.length, position })
  }

  // Oudste post krijgt de laagste datum, zodat de volgorde in de lijst vast blijft.
  const createdAt = new Date(Date.now() - (demoPosts.length - index) * 60_000).toISOString()
  const { error: campaignError } = await supabase.from('campaigns').insert({ id: post.id, title: post.title, created_by: admin.id, created_at: createdAt })
  if (campaignError) throw campaignError

  const variants = (Object.keys(post.copy) as DemoLanguage[]).flatMap((language) =>
    post.copy[language].map((copy, i) => ({ campaign_id: post.id, language, variant_no: i + 1, copy })),
  )
  const { error: variantError } = await supabase.from('campaign_variants').insert(variants)
  if (variantError) throw variantError

  const { error: mediaError } = await supabase.from('campaign_media').insert(
    uploaded.map((item) => ({
      campaign_id: post.id,
      kind: 'image',
      storage_path: item.storagePath,
      mime_type: item.type,
      size_bytes: item.size,
      position: item.position,
    })),
  )
  if (mediaError) throw mediaError

  console.log(`ok: ${post.title} (${post.photos.length} foto${post.photos.length > 1 ? "'s" : ''}, ${variants.length} teksten)`)
}
