# Locinox Advocacy (AI-case)

Prototype van een employee advocacy platform: een **admin** zet social-mediaposts klaar (afbeelding, video of carrousel) en een **medewerker** neemt ze over om te delen op sociale media.

De opdracht staat in [`docs/opdracht.md`](docs/opdracht.md), de werkafspraken in [`AGENTS.md`](AGENTS.md).

> Status: projectsetup. De kernflow (auth, posts klaarzetten, delen) volgt in aparte feature-branches.

## Prototype

Publieke link: _volgt na de eerste deployment_.

## Testaccounts

| Rol | Taal | E-mail |
|---|---|---|
| Admin | EN | _volgt_ |
| Medewerker 1 | EN | _volgt_ |
| Medewerker 2 | FR | _volgt_ |
| Medewerker 3 | DE | _volgt_ |

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

## Structuur

```
src/
  views/         pagina's per route
  components/    herbruikbare componenten
  composables/   gedeelde logica (Composition API)
  lib/           clients en helpers (Supabase, delen)
  router/        routes en guards
  i18n/          interfacevertalingen (EN, FR, DE, NL)
docs/            opdracht, beslissingen, onderzoek, uitleg, demo
```

## Documentatie

- [`docs/beslissingen.md`](docs/beslissingen.md): gemaakte keuzes en wat bewust niet gebouwd is
