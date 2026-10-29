# Uitleg bij het prototype

> **De halve pagina uitleg voor de oplevering staat in [`uitleg.pdf`](uitleg.pdf)** (in de stijl van de app). Dit document is de uitgebreide versie, met het logboek van wat AI per onderdeel deed. De PDF maak je opnieuw met `npm run pdf:uitleg` (bron: [`uitleg-pdf/uitleg.html`](uitleg-pdf/uitleg.html)).

**Prototype:** https://locinox-case.vercel.app (testaccounts: zie de mail bij de oplevering; de wachtwoorden staan bewust niet in de repo). Code: https://github.com/nebitje/locinoxCase

## Tools en waarom
Ik bouwde met **Claude Code** (Claude Sonnet 5.5) als AI-codeertool, in een vaste werkwijze: eerst vragen, dan een plan dat ik goedkeurde, dan één feature per branch met commits die ik zelf testte en pas daarna pushte en mergede. De app is een **Vue 3-frontend** (Vite, TypeScript, Tailwind, vue-i18n) met een eigen ontwerp op basis van het palet en het lettertype van locinox.com, op **Vercel**, met **Supabase** voor login, database met rolregels (Row Level Security) en opslag van afbeeldingen en video's. Reden: gratis, snel online en de rolcontrole zit op de server. Eén kleine serverfunctie geeft LinkedIn een publieke pagina met preview.

## Wat AI voor mij deed
AI schreef de code, migraties, tests en documentatie, deed het onderzoek in de LinkedIn- en browserdocumentatie en stelde keuzes met alternatieven voor. Ik koos de uitbreiding (talen en varianten), de tools en wat niet gebouwd werd, en ik testte alles. AI maakte ook fouten die ik of de tests vingen, bijvoorbeeld een deellink naar een beschermde Vercel-URL waardoor LinkedIn "Dashboard – Vercel" toonde, en bijna een commit van lokale sleutels in een voorbeeldbestand. De code is zo gestructureerd dat Locinox ze kan overnemen (zie [`architectuur.md`](architectuur.md)), met een test die de structuur bewaakt. Een gedetailleerd logboek per branch staat hieronder.

## Wat het LinkedIn-onderzoek opleverde
Zie [`linkedin-onderzoek.md`](linkedin-onderzoek.md). Kort: statistieken per post, per lid en per bedrijfspagina bestaan via de Community Management API, maar vragen een goedgekeurde app en toestemming van elk lid. Met onze huidige deellink weten we niet welke LinkedIn-post bij welke campagne hoort, dus statistieken per campagne zijn pas mogelijk als de app zelf post of via eigen klik-tracking.

## Wat (nog) niet werkt
- **Desktop:** LinkedIn krijgt enkel een link. De tekst staat op het klembord en moet geplakt worden; video en carrousel kunnen daar niet automatisch mee. Bij video is er geen preview-beeld.
- **Mobiel:** getest op Android Chrome (deelvenster met bestanden werkt). **iPhone niet getest.**
- Posts kunnen niet bewerkt worden, de titel is niet vertaald, en "gedeeld" betekent "op delen geklikt", niet "gepost".
- Niet gebouwd: boostcampagnes, dashboard en externe statistieken.
- **Ontwerp:** witte tekst op het oranje van Locinox haalt ±3,3 : 1 contrast, onder WCAG AA voor gewone tekst. Dat staat met de oplossing (één regel) in `docs/beslissingen.md`.
- **Tests:** unit-tests voor de logica en de structuur, maar geen componenttests of end-to-end-tests; de kernflow wordt manueel getest.

## Wat ik als volgende zou bouwen
1. Eigen klik-tracking op de publieke postpagina en een klein dashboard (shares en klikken per campagne en per medewerker).
2. Posts bewerken en een beheerscherm voor demo-inhoud.
3. Boostcampagnes (een knop naar de bedrijfspost).
4. De Development Tier van de LinkedIn Community Management API aanvragen en proefdraaien.

## Logboek: wat AI per onderdeel deed
| Onderdeel | Wat AI deed | Wat ik deed |
|---|---|---|
| Plan | Vragen, opties voor backend en delen, tijdsplanning | Keuzes goedgekeurd (Supabase en Vercel, talen als uitbreiding) |
| Setup | Vue-project, linting, tests, Vercel-configuratie | Accounts aangemaakt, sleutels beheerd |
| Login en rollen | Supabase-auth, rolregels op de server, seedscript | Getest met alle accounts |
| Posts klaarzetten | Formulier, validatie, uploads, opruimen bij fouten | Getest met afbeelding, video en carrousel |
| Delen | Onderzoek, aanpak per toestel, publieke previewpagina | Getest op desktop en Android, bug met preview gemeld |
| Fix preview | Oorzaak gevonden (beschermde URL), vast publiek adres | Getest op productie |
| Talen en varianten | Tabs, variantkeuze, terugval, preview per taal | Lokaal getest |
| Demoposts | Seedscript, fictieve teksten in vier talen, bronvermelding | Foto's zelf gedownload (Unsplash blokkeert scripts), seed gedraaid |
| Architectuur | Herschikking in lagen en features, UI-bibliotheek, architectuurtest | Alle schermen getest na de herschikking |
| Opmaak | Palet uit de live site, design tokens, donkere modus, animaties, styleguide | Gekeken en bijgestuurd ("maak er echt iets moois van") |
| Documentatie | LinkedIn-onderzoek, beslissingenlog, testprocedure, demoscript, architectuur | Gecontroleerd |
