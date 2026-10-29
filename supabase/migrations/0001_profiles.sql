-- Profielen met rol en voorkeurstaal, gekoppeld aan Supabase Auth.
-- Uitvoeren in het Supabase-dashboard: SQL Editor -> New query -> plakken -> Run.

create type public.user_role as enum ('admin', 'employee');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 80),
  role public.user_role not null default 'employee',
  preferred_language text not null default 'en' check (preferred_language in ('en', 'fr', 'de', 'nl')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Helper zonder RLS-recursie: is de ingelogde gebruiker admin?
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Iedereen ziet enkel het eigen profiel; admins zien alle profielen.
create policy "profiel lezen: eigen of admin"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_admin());

-- Gebruikers mogen enkel het eigen profiel aanpassen, en enkel de voorkeurstaal.
create policy "profiel wijzigen: enkel eigen"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

revoke update on public.profiles from authenticated;
grant update (preferred_language) on public.profiles to authenticated;

-- Insert en delete zijn niet toegestaan voor clients; het seedscript gebruikt de service role.
