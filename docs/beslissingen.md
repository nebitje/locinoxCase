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

## Bewust niet gebouwd

- Boostcampagnes, admin-dashboard en externe statistieken: alleen onderzocht, tenzij er tijd overblijft.
- Registratie, coins en beloningen, contentkalender, mails en ledenbeheer: buiten de opdracht.
- Echte LinkedIn-API-integratie: onderzoeken, niet bouwen.
