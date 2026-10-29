# Locinox Advocacy (AI-case)

Prototype van een employee advocacy platform: een **admin** zet social-mediaposts klaar (afbeelding, video of carrousel) en een **medewerker** neemt ze over om te delen op sociale media.

De opdracht staat in [`docs/opdracht.md`](docs/opdracht.md), de werkafspraken in [`AGENTS.md`](AGENTS.md).

> Status: projectsetup. De kernflow (auth, posts klaarzetten, delen) volgt in aparte feature-branches.

## Prototype

Publieke link: _volgt na de eerste deployment_.

## Testaccounts

| Rol | Taal | E-mail |
|---|---|---|
| Admin | EN | admin@example.com |
| Medewerker 1 | EN | employee.en@example.com |
| Medewerker 2 | FR | employee.fr@example.com |
| Medewerker 3 | DE | employee.de@example.com |

De wachtwoorden staan niet in de repo. Ze worden bij het seeden uit omgevingsvariabelen gelezen.

## Lokaal opstarten

Vereist Node.js 22.12 of nieuwer.

```bash
npm install
cp .env.example .env   # vul de waarden in
npm run dev
```

| Script | Doel |
|---|---|
| `npm run dev` | Ontwikkelserver |
| `npm run build` | Typecheck en productiebuild |
| `npm run lint` | ESLint |
| `npm test` | Vitest |
| `npm run seed` | Testaccounts aanmaken in Supabase |

### Supabase instellen (eenmalig)

1. Open in het Supabase-dashboard **SQL Editor**, plak de inhoud van [`supabase/migrations/0001_profiles.sql`](supabase/migrations/0001_profiles.sql) en klik op **Run**.
2. Voer daarna ook [`supabase/migrations/0002_campaigns.sql`](supabase/migrations/0002_campaigns.sql) uit (tabellen voor posts en de opslagbucket `campaign-media`).
3. Zet de wachtwoorden in `.env` (`SEED_ADMIN_PASSWORD`, `SEED_EMPLOYEE_PASSWORD`).
4. Maak de testaccounts aan met `npm run seed` (opnieuw uitvoeren mag, het script is idempotent).

## Structuur

```
src/
  views/         pagina's per route
  components/    herbruikbare componenten
  composables/   gedeelde logica (Composition API)
  lib/           clients en helpers (Supabase, delen)
  router/        routes en guards
  i18n/          interfacevertalingen (EN, FR, DE, NL)
scripts/         seedscript voor testaccounts
supabase/        SQL-migraties
docs/            opdracht, beslissingen, onderzoek, uitleg, demo
```

## Documentatie

- [`docs/beslissingen.md`](docs/beslissingen.md): gemaakte keuzes en wat bewust niet gebouwd is
