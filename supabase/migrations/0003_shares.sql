-- Registratie van gedeelde posts (basis voor latere statistieken).
-- Uitvoeren in het Supabase-dashboard: SQL Editor -> New query -> plakken -> Run.

create table public.shares (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns (id) on delete cascade,
  user_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  method text not null check (method in ('native', 'linkedin')),
  created_at timestamptz not null default now()
);

create index shares_campaign_idx on public.shares (campaign_id);
create index shares_user_idx on public.shares (user_id);

alter table public.shares enable row level security;

-- Een gebruiker registreert en ziet enkel zijn eigen shares; admins zien alle shares.
create policy "shares aanmaken: enkel eigen" on public.shares for insert to authenticated
  with check (user_id = auth.uid());
create policy "shares lezen: eigen of admin" on public.shares for select to authenticated
  using (user_id = auth.uid() or public.is_admin());
