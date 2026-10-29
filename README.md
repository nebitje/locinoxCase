# Locinox Advocacy (AI-case)

Prototype van een employee advocacy platform: een **admin** zet social-mediaposts klaar (afbeelding, video of carrousel) en een **medewerker** neemt ze over om te delen op sociale media.

De opdracht staat in [`docs/opdracht.md`](docs/opdracht.md), de werkafspraken in [`AGENTS.md`](AGENTS.md).

> Status: de kernflow (login met twee rollen, posts klaarzetten, overnemen en delen) en de uitbreiding met meerdere talen en varianten werken. Wat niet werkt of niet getest is, staat in [`docs/uitleg.md`](docs/uitleg.md).

## Prototype

Publieke link: https://locinox-case.vercel.app

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
| `npm run seed:demo` | Demoposts met rechtenvrije foto's aanmaken (zie `scripts/demo-assets/CREDITS.md`); opnieuw uitvoeren vervangt ze |

### Supabase instellen (eenmalig)

1. Open in het Supabase-dashboard **SQL Editor**, plak de inhoud van [`supabase/migrations/0001_profiles.sql`](supabase/migrations/0001_profiles.sql) en klik op **Run**.
2. Voer daarna ook [`supabase/migrations/0002_campaigns.sql`](supabase/migrations/0002_campaigns.sql) uit (tabellen voor posts en de opslagbucket `campaign-media`).
   Voer ook [`supabase/migrations/0003_shares.sql`](supabase/migrations/0003_shares.sql) (registratie van shares) en [`0004_shares_variant.sql`](supabase/migrations/0004_shares_variant.sql) (taal en variant per share) uit.
3. Zet de wachtwoorden in `.env` (`SEED_ADMIN_PASSWORD`, `SEED_EMPLOYEE_PASSWORD`).
4. Maak de testaccounts aan met `npm run seed` (opnieuw uitvoeren mag, het script is idempotent).

## Structuur

```
src/
  app/           applicatie: App.vue, router, globale stijl
  pages/         één bestand per route (dun, stelt samen)
  features/      per domein: auth, campaigns, sharing (logica en componenten)
  ui/            herbruikbare bouwstenen: atoms, molecules, organisms, templates
  shared/        vertalingen (EN, FR, DE, NL) en de Supabase-client
api/             serverless functie voor de publieke postpagina (Open Graph)
scripts/         seedscripts (testaccounts en demoposts)
supabase/        SQL-migraties
docs/            opdracht, beslissingen, architectuur, onderzoek, uitleg, demo
```

De regels achter deze indeling staan in [`docs/architectuur.md`](docs/architectuur.md) en worden door een test bewaakt.

## Documentatie

- [`docs/beslissingen.md`](docs/beslissingen.md): gemaakte keuzes, de aanpak en beperkingen van het delen, en wat bewust niet gebouwd is
- [`docs/architectuur.md`](docs/architectuur.md): mappenstructuur, regels en waar nieuwe code thuishoort (voor de overdracht)
- [`docs/testprocedure.md`](docs/testprocedure.md): manuele testprocedure van de kernflow
- [`docs/linkedin-onderzoek.md`](docs/linkedin-onderzoek.md): wat LinkedIn officieel toelaat voor integratie en rapportering
- [`docs/uitleg.pdf`](docs/uitleg.pdf): de halve pagina uitleg voor de oplevering, in de stijl van de app
- [`docs/uitleg.md`](docs/uitleg.md): uitgebreide versie van de uitleg, wat niet werkt en het logboek van wat AI deed
- [`docs/demo.md`](docs/demo.md): script voor de korte demo

## Wiki

De documentatie staat ook in de [GitHub-wiki](https://github.com/nebitje/locinoxCase/wiki). De wiki is een gegenereerde kopie van `README.md` en `docs/`: pas de bronbestanden aan en voer `npm run wiki:sync` uit (of `npm run wiki:build` om enkel de pagina's in `.wiki-build/` te bekijken). Het script publiceert pas na `--push` en vraagt dat de wiki eerst op GitHub is aangezet.

## Deployment (Vercel)

Zet in Vercel onder **Settings → Environment Variables**:

| Variabele | Waarde |
|---|---|
| `VITE_SUPABASE_URL` | Project-URL van Supabase |
| `VITE_SUPABASE_ANON_KEY` | Publieke (anon) sleutel |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role-sleutel, als *Secret*. Enkel gebruikt door de serverless functie `api/p.ts` voor de publieke postpagina (`/p/<id>`); komt nooit in de frontend. |
| `VITE_PUBLIC_URL` | Het vaste publieke adres, bv. `https://locinox-case.vercel.app` (zonder pad). Daarmee wijst de deellink altijd naar het publieke domein. Zonder deze variabele gebruikt de app het adres van de huidige pagina, en dat is bij een preview- of deployment-URL van Vercel (achter login) onbruikbaar voor LinkedIn. |

Variabelen werken pas na een nieuwe deployment (**Redeploy**).
