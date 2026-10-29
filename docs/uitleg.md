# Uitleg bij het prototype

**Prototype:** https://locinox-case.vercel.app (testaccounts: zie de mail bij de oplevering; de wachtwoorden staan bewust niet in de repo). Code: https://github.com/nebitje/locinoxCase

## Tools en waarom
Ik bouwde met **Claude Code** (Claude Sonnet 5.5) als AI-codeertool, in een vaste werkwijze: eerst vragen, dan een plan dat ik goedkeurde, dan één feature per branch met commits die ik zelf testte en pas daarna pushte en mergede. De app is een **Vue 3-frontend** (Vite, TypeScript, Tailwind, vue-i18n) op **Vercel**, met **Supabase** voor login, database met rolregels (Row Level Security) en opslag van afbeeldingen en video's. Reden: gratis, snel online en de rolcontrole zit op de server. Eén kleine serverfunctie geeft LinkedIn een publieke pagina met preview.

## Wat AI voor mij deed
AI schreef de code, migraties, tests en documentatie, deed het onderzoek in de LinkedIn- en browserdocumentatie en stelde keuzes met alternatieven voor. Ik koos de uitbreiding (talen en varianten), de tools en wat niet gebouwd werd, en ik testte alles. AI maakte ook fouten die ik of de tests vingen, bijvoorbeeld een deellink naar een beschermde Vercel-URL waardoor LinkedIn "Dashboard – Vercel" toonde, en bijna een commit van lokale sleutels in een voorbeeldbestand. Een gedetailleerd logboek per branch staat hieronder.

## Wat het LinkedIn-onderzoek opleverde
Zie [`linkedin-onderzoek.md`](linkedin-onderzoek.md). Kort: statistieken per post, per lid en per bedrijfspagina bestaan via de Community Management API, maar vragen een goedgekeurde app en toestemming van elk lid. Met onze huidige deellink weten we niet welke LinkedIn-post bij welke campagne hoort, dus statistieken per campagne zijn pas mogelijk als de app zelf post of via eigen klik-tracking.

## Wat (nog) niet werkt
- **Desktop:** LinkedIn krijgt enkel een link. De tekst staat op het klembord en moet geplakt worden; video en carrousel kunnen daar niet automatisch mee. Bij video is er geen preview-beeld.
- **Mobiel:** getest op Android Chrome (deelvenster met bestanden werkt). **iPhone niet getest.**
- Posts kunnen niet bewerkt worden, de titel is niet vertaald, en "gedeeld" betekent "op delen geklikt", niet "gepost".
- Niet gebouwd: boostcampagnes, dashboard en externe statistieken.

## Wat ik als volgende zou bouwen
1. Eigen klik-tracking op de publieke postpagina en een klein dashboard (shares en klikken per campagne en per medewerker).
2. Posts bewerken en demo-inhoud beheren.
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
| Documentatie | LinkedIn-onderzoek, beslissingenlog, testprocedure, demoscript | Gecontroleerd |
