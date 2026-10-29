-- Bij een share bewaren we ook de gekozen taal en variant (voor latere statistieken per taal).
-- Uitvoeren in het Supabase-dashboard: SQL Editor -> New query -> plakken -> Run.

alter table public.shares
  add column language text check (language in ('en', 'fr', 'de', 'nl')),
  add column variant_no integer check (variant_no between 1 and 10);
