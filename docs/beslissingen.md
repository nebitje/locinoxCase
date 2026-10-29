# Beslissingen

Log van de belangrijke keuzes: wat, waarom, welke alternatieven, en wat bewust niet gebouwd is.

## Technologie

| Keuze | Waarom | Alternatieven |
|---|---|---|
| Vue 3 + Vite + TypeScript | Opgelegd (Vue 3). TypeScript helpt bij het datamodel en de API-types. | JavaScript: sneller te schrijven, minder veilig. |
| Vue Router | Aparte weergaven per rol en een publieke detailroute. | Geen router: past niet bij meerdere schermen. |
| `vue-i18n` | Interface in EN, FR, DE en NL. | Eigen vertaalfunctie: meer werk voor pluralen en fallback. |
| Tailwind CSS | Snel responsive bouwen voor desktop en mobiel. | Eigen CSS of een UI-library: trager of zwaarder. |
| Vitest + ESLint | Tests en lint, in lijn met Vite. | Jest: extra configuratie. |
| Geen Pinia | De state is klein genoeg voor composables. | Pinia: extra dependency zonder duidelijke winst. |
| Node.js 26 LTS lokaal | Nodig voor de nieuwste Vite (versie 8). De `engines`-eis blijft ruimer (>=22.12) voor hosting. | Node 20: te oud voor Vite 8. |

## Backend en hosting (voorstel, goedgekeurd)

Supabase (database, auth, opslag, Row Level Security) en Vercel (hosting en een serverless functie voor de Open Graph-pagina). Alternatieven (eigen Node-API met SQLite, Firebase) zijn afgewogen in het plan: meer eigen code of omslachtiger rollen en datamodel.

## Authenticatie en rollen

- Supabase Auth (e-mail en wachtwoord) met een tabel `profiles` (rol, naam, voorkeurstaal).
- De rol wordt op de server afgedwongen met Row Level Security: een gebruiker ziet enkel zijn eigen profiel, admins zien alle profielen, en `role` kan niet vanuit de client gewijzigd worden (kolomrechten: enkel `preferred_language`). Route-guards in de frontend zijn enkel UX; de echte controle volgt in de RLS-regels van elke tabel.
- Geen registratie: de testaccounts komen uit een idempotent seedscript (`npm run seed`) dat wachtwoorden uit omgevingsvariabelen leest. De seed gebruikt de service-role-sleutel en draait enkel lokaal.
- Testaccounts gebruiken `@example.com`-adressen (gereserveerd domein), zodat er nooit mail naar een echt adres kan gaan.
- Alternatief: rol in de JWT-metadata. Niet gekozen, omdat een rolwijziging dan pas bij de volgende login geldt.

## Bewust niet gebouwd

- Boostcampagnes, admin-dashboard en externe statistieken: alleen onderzocht, tenzij er tijd overblijft.
- Registratie, coins en beloningen, contentkalender, mails en ledenbeheer: buiten de opdracht.
- Echte LinkedIn-API-integratie: onderzoeken, niet bouwen.
