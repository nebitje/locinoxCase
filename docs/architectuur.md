# Architectuur

Dit document legt de structuur van de frontend uit, zodat een ander team het prototype kan overnemen en uitbreiden. De regels worden bewaakt door een test (`tests/architecture.test.ts`).

## Overzicht

```
src/
  main.ts            ingang: start de sessie, router en vertalingen
  app/               de applicatie zelf: App.vue, router, globale stijl
  pages/             één bestand per route; dun, stelt enkel samen
  features/          één map per functioneel domein, met eigen logica en componenten
    auth/            inloggen, sessie, rolcontrole (guard)
    campaigns/       posts: ophalen, aanmaken, verwijderen, media en tekstvarianten
    sharing/         delen op LinkedIn en via het deelvenster van het toestel
  ui/                herbruikbare bouwstenen zonder domeinkennis (atomic design)
    atoms/           kleinste onderdelen: knop, invoerveld, melding, badge
    molecules/       combinaties van atoms: formulierveld, tabs, foutmelding met "opnieuw"
    organisms/       zelfstandige blokken: de applicatiebalk
    templates/       paginaskeletten: PageLayout
  shared/            kleine gedeelde bouwstenen zonder UI: vertalingen (i18n), Supabase-client
```
Buiten `src/`: `api/` (serverless functie voor de publieke postpagina), `supabase/` (SQL-migraties), `scripts/` (seeds), `docs/`.

## Regels

1. **Lagen mogen alleen naar beneden kijken.** Een laag gebruikt enkel de lagen hieronder:

   | Laag | Mag gebruiken |
   |---|---|
   | `shared` | `shared` |
   | `ui` | `shared`, `ui` |
   | `features` | `shared`, `ui`, `features` |
   | `pages` | `shared`, `ui`, `features`, `pages` |
   | `app` | alles |

2. **Features zijn onafhankelijk.** `auth` en `campaigns` kennen geen andere feature; `sharing` mag `campaigns` gebruiken (het deelt een post). Nieuwe afhankelijkheden voeg je bewust toe in `FEATURE_DEPENDENCIES` in de test.
3. **`ui` kent het domein niet.** Een knop weet niets van een post. Alles wat "post", "campagne" of "medewerker" noemt, hoort in een feature. Teksten komen via props of slots binnen, of via de vertalingen in `shared`.
4. **Pagina's bevatten geen logica.** Ze lezen de route, roepen een composable of feature-component aan en zetten het resultaat op de pagina. Logica staat in `use…`-composables of in pure functies.
5. **Imports:** binnen dezelfde map relatief (`./api`), tussen lagen of features met de alias (`@/features/campaigns/api`). Relatief naar een andere laag (`../`) is niet toegestaan.
6. **Pure logica los van Vue.** Regels zoals de mediavalidatie (`media-validation.ts`), de variantenlogica (`variants.ts`) en de deelkeuze (`share.ts`) zijn gewone TypeScript-functies met tests naast het bestand. `media-validation.ts` mag geen imports bevatten, want de seedscripts in `scripts/` lezen dat bestand rechtstreeks met Node.

## Waar hoort iets thuis?

| Ik wil… | Dan… |
|---|---|
| een nieuwe knopstijl of invoerveld | `ui/atoms/` |
| een veld met label en foutmelding | `ui/molecules/` |
| een scherm voor een nieuwe route | `pages/` + route in `app/router/index.ts` |
| een nieuw domein (bijvoorbeeld statistieken) | nieuwe map `features/<naam>/` met `api.ts`, composables, `components/` |
| een component die post-gegevens toont | `features/campaigns/components/` |
| een nieuwe taal in de interface | `shared/i18n/messages/<taal>.ts` en `SUPPORTED_LOCALES` |
| een nieuwe databasetabel | migratie in `supabase/migrations/`, daarna `api.ts` van de feature |

## Opmaak
- Kleuren, lettertype en afrondingen zijn **design tokens** in `src/app/style.css`. Gebruik in componenten enkel de semantische klassen (`bg-surface`, `text-ink`, `border-line`, `bg-brand`, …) en geen losse Tailwind-kleuren zoals `slate-500`; dan werkt de donkere modus vanzelf.
- Het thema (licht of donker) staat in `shared/theme.ts`; de wisselknop is `ui/molecules/ThemeToggle.vue`.
- Beweging staat als `animate-*`-klassen en `@keyframes` in `src/app/style.css` en wordt uitgezet bij `prefers-reduced-motion`. Gebruik enkel `transform` en `opacity` voor animaties.
- De route `/styleguide` (`pages/StyleguidePage.vue`) toont tokens en bouwstenen op voorbeelddata; voeg een nieuwe bouwsteen daar toe zodat het ontwerp zichtbaar en controleerbaar blijft.
- Meer over de keuzes en het contrast: [`beslissingen.md`](beslissingen.md#opmaak-en-donkere-modus).

## Gegevens en rollen
- De frontend praat rechtstreeks met Supabase (`shared/supabase.ts`); de rollen worden afgedwongen met Row Level Security in de database, niet in de frontend. De route-guard (`features/auth/guard.ts`) is enkel UX.
- Eén serverless functie (`api/p.ts`) bouwt de publieke postpagina met Open Graph-tags voor de LinkedIn-preview. Ze gebruikt de service-role-sleutel enkel op de server.

## Tests
- Pure logica heeft unit-tests (Vitest) naast de code. De mappenregels staan in `tests/architecture.test.ts`.
- Er zijn geen componenttests of end-to-end-tests; de kernflow wordt manueel getest volgens [`testprocedure.md`](testprocedure.md). Een logisch vervolg is Playwright voor de kernflow.

## Waarom geen zuiver atomic design?
Atomic design wordt hier enkel toegepast op de herbruikbare UI-bibliotheek (`ui/`). Een post, een delen-knop of een formulier voor een campagne zijn geen universele bouwstenen maar domeinonderdelen, en horen bij hun feature. Met een app van ongeveer vijftig bestanden zou een strikte indeling in atoms, molecules en organisms voor álle componenten meer zoekwerk geven dan duidelijkheid. De hybride indeling blijft schaalbaar: een nieuw domein is een nieuwe map in `features/`, een nieuwe herbruikbare bouwsteen een nieuw bestand in `ui/`.
