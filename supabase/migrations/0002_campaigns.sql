-- Campagnes (posts), tekstvarianten per taal en media, plus de opslagbucket.
-- Uitvoeren in het Supabase-dashboard: SQL Editor -> New query -> plakken -> Run.

create table public.campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 120),
  created_by uuid not null references public.profiles (id),
  created_at timestamptz not null default now()
);

-- Tekst per taal en variant. De kern gebruikt één variant (taal 'en', nummer 1);
-- de uitbreiding voegt talen en extra varianten toe zonder schemawijziging.
create table public.campaign_variants (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  language text not null check (language in ('en', 'fr', 'de', 'nl')),
  variant_no integer not null default 1 check (variant_no between 1 and 10),
  copy text not null check (char_length(copy) between 1 and 3000),
  unique (campaign_id, language, variant_no)
);

-- Media van een campagne, in volgorde. Eén afbeelding, één video of meerdere afbeeldingen (carrousel).
create table public.campaign_media (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  kind text not null check (kind in ('image', 'video')),
  storage_path text not null unique,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0),
  position integer not null check (position between 0 and 9),
  unique (campaign_id, position)
);

create index campaign_variants_campaign_idx on public.campaign_variants (campaign_id);
create index campaign_media_campaign_idx on public.campaign_media (campaign_id);

alter table public.campaigns enable row level security;
alter table public.campaign_variants enable row level security;
alter table public.campaign_media enable row level security;

-- Lezen: elke ingelogde gebruiker. Schrijven: enkel admins.
create policy "campagnes lezen" on public.campaigns for select to authenticated using (true);
create policy "campagnes aanmaken" on public.campaigns for insert to authenticated
  with check (public.is_admin() and created_by = auth.uid());
create policy "campagnes wijzigen" on public.campaigns for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "campagnes verwijderen" on public.campaigns for delete to authenticated
  using (public.is_admin());

create policy "varianten lezen" on public.campaign_variants for select to authenticated using (true);
create policy "varianten aanmaken" on public.campaign_variants for insert to authenticated
  with check (public.is_admin());
create policy "varianten wijzigen" on public.campaign_variants for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "varianten verwijderen" on public.campaign_variants for delete to authenticated
  using (public.is_admin());

create policy "media lezen" on public.campaign_media for select to authenticated using (true);
create policy "media aanmaken" on public.campaign_media for insert to authenticated
  with check (public.is_admin());
create policy "media wijzigen" on public.campaign_media for update to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy "media verwijderen" on public.campaign_media for delete to authenticated
  using (public.is_admin());

-- Opslagbucket. Publiek leesbaar, want LinkedIn en de Web Share API moeten de bestanden kunnen ophalen.
-- De server beperkt het bestandstype en de maximale grootte (50 MB, het maximum van het gratis plan);
-- de strengere limiet voor afbeeldingen (5 MB) wordt in de frontend gecontroleerd.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'campaign-media',
  'campaign-media',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Uploaden, wijzigen en verwijderen: enkel admins.
create policy "media-bestanden uploaden" on storage.objects for insert to authenticated
  with check (bucket_id = 'campaign-media' and public.is_admin());
create policy "media-bestanden wijzigen" on storage.objects for update to authenticated
  using (bucket_id = 'campaign-media' and public.is_admin());
create policy "media-bestanden verwijderen" on storage.objects for delete to authenticated
  using (bucket_id = 'campaign-media' and public.is_admin());
