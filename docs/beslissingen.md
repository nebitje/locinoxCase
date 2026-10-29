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

## Posts klaarzetten (admin)

- **Datamodel:** `campaigns`, `campaign_variants` (tekst per taal en variant) en `campaign_media` (bestanden in volgorde). Het formaat (afbeelding, video of carrousel) wordt afgeleid uit de media en niet apart opgeslagen, zodat het nooit kan afwijken.
- **Eén variant in de kern:** het formulier bewaart één tekst (taal `en`, variant 1). Het schema ondersteunt al meerdere talen en varianten; de interface daarvoor komt in `feature/talen-varianten`.
- **Uploadregels:** één afbeelding (max 5 MB), één video (max 50 MB) of 2 tot 10 afbeeldingen als carrousel. Afbeeldingen en video mengen kan niet. De regels staan op één plaats (`src/lib/media-validation.ts`, met tests).
- **Server-side controle:** de opslagbucket weigert andere bestandstypen en alles boven 50 MB, en enkel admins mogen uploaden of verwijderen (RLS). **Beperking:** de strengere limiet van 5 MB voor afbeeldingen wordt enkel in de frontend gecontroleerd; de server dwingt per type geen aparte limiet af.
- **Publieke bucket:** de bestanden zijn leesbaar via een openbare URL, want LinkedIn en de Web Share API moeten ze kunnen ophalen. De URL's bevatten een willekeurig id en zijn niet te raden, maar wie een link heeft kan het bestand openen.
- **Geen atomaire opslag:** bestanden uploaden en de rijen opslaan zijn losse aanvragen. Bij een fout ruimt de code de al geüploade bestanden en de campagne op (best effort). In het slechtste geval blijft een los bestand in de bucket achter.
- **Niet gebouwd:** posts achteraf bewerken, concepten en plannen. Een foute post verwijder je en maak je opnieuw aan.

## Delen door de medewerker

**Wat het onderzoek opleverde**

- LinkedIn's deel-URL (`https://www.linkedin.com/sharing/share-offsite/?url=…`) neemt in de praktijk enkel een `url` aan. Titel, beschrijving en beeld komen uit de Open Graph-tags van die pagina. **Let op:** dit staat niet in de officiële LinkedIn-documentatie (die beschrijft enkel de Share Plugin en de API met OAuth); het is bevestigd door meerdere community-bronnen en moet dus als niet-officieel gelden. Tekst of media meegeven via de URL kan niet.
- De Web Share API (`navigator.share`) kan tekst en bestanden delen, maar enkel vanuit een klik, enkel via HTTPS, en niet in Firefox op desktop. Altijd vooraf testen met `navigator.canShare({ files })`. Bron: [MDN: Navigator.share()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/share) en [Can I use: Web Share](https://caniuse.com/web-share).
- Het klembord ondersteunt breed tekst en PNG-afbeeldingen. Bron: [MDN: Clipboard.write()](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/write).
- Een post met afbeelding, video of carrousel aanmaken via de LinkedIn-API vraagt OAuth met `w_member_social` en een goedgekeurde app; dat bouwen we niet (zie het LinkedIn-onderzoek). Bron: [Share on LinkedIn](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin).

**Gekozen aanpak**

| Situatie | Wat er gebeurt |
|---|---|
| **Mobiel**, bestanden deelbaar | Eén tik op *Delen* opent het deelvenster van het toestel met de bestanden en de tekst. De medewerker kiest LinkedIn. De tekst gaat tegelijk naar het klembord, voor het geval LinkedIn hem niet invult. |
| **Desktop** (of mobiel zonder bestandsondersteuning) | Eén klik op *Delen op LinkedIn* opent LinkedIn met een link naar onze publieke postpagina (`/p/<id>`). Die pagina heeft Open Graph-tags, zodat LinkedIn een preview met beeld toont. De tekst staat op het klembord en wordt in de post geplakt. |
| **Desktop, één afbeelding** | Extra knop *Afbeelding kopiëren* (PNG op het klembord), zodat de afbeelding zelf in de LinkedIn-editor geplakt kan worden. |

De medewerker moet nergens iets downloaden. De bestanden worden op mobiel vooraf opgehaald, zodat het deelvenster binnen de klik geopend wordt (Safari weigert dat anders).

**Beperkingen (eerlijk)**

- Op desktop krijgt LinkedIn enkel een link. Een video of de volledige carrousel kan niet automatisch bijgevoegd worden; de preview toont de eerste afbeelding, bij een video is er geen preview-beeld.
- Op mobiel hangt het van de LinkedIn-app en het besturingssysteem af of de tekst bij de bestanden ingevuld wordt. Daarom staat de tekst ook op het klembord. **Test op een echt toestel:** op Android Chrome opent het deelvenster van de telefoon met de bestanden en werkt het delen naar LinkedIn goed. Op desktop (Firefox) opent LinkedIn met de link en de preview. **iPhone (Safari) is niet getest**, video en carrousel op mobiel zijn niet apart gedocumenteerd getest.
- Of een carrousel van meerdere afbeeldingen via het deelvenster als meerdere beelden in LinkedIn terechtkomt, hangt eveneens van de app af. Een echte LinkedIn-carrousel is een PDF-document, wat buiten dit prototype valt.
- LinkedIn bewaart previews in een cache. Na een wijziging van een post kan de preview tot enkele uren oud blijven; de Post Inspector van LinkedIn kan dat verversen.

**Vast publiek adres voor de deellink:** de deellink gebruikte eerst het adres van de huidige pagina. Wie de app via een unieke deployment-URL van Vercel opende (bijvoorbeeld via de knop *Visit* in het dashboard), deelde daardoor een link achter Vercel-login, en LinkedIn toonde "Dashboard – Vercel" als preview. Gevonden bij de eerste test op productie. Oplossing: de omgevingsvariabele `VITE_PUBLIC_URL` met het vaste publieke domein, met terugval op het huidige adres (getest in `resolvePublicOrigin`).

**Publieke postpagina** (`api/p.ts`): een serverless functie op Vercel die met de service-role-sleutel (enkel op de server) de post leest en een HTML-pagina met Open Graph-tags teruggeeft. Het id is een willekeurige UUID. Mensen worden doorgestuurd naar de app. Titel en beschrijving worden ge-escaped, het id wordt als UUID gevalideerd.

**Registratie van shares:** elke share wordt best-effort in de tabel `shares` bewaard (basis voor latere statistieken). Een mislukte registratie blokkeert het delen niet. Een share is "een klik op delen"; of de medewerker effectief gepost heeft, weten we niet (de deel-URL geeft geen terugkoppeling).

## Meerdere talen en varianten (eigen uitbreiding)

- **Keuze van de uitbreiding:** talen en varianten, omdat het de kernflow direct versterkt (de juiste tekst voor de juiste medewerker) en haalbaar is in één dag. Boostcampagnes en het dashboard zijn niet gebouwd.
- **Schema ongewijzigd:** `campaign_variants` had al taal en variantnummer; de uitbreiding is enkel interface en logica. Alle logica staat in `src/lib/variants.ts` met tests.
- **Admin:** per post een tab per taal (EN, FR, DE, NL) met 1 tot 5 varianten. EN, FR en DE zijn verplicht (zoals de opdracht vraagt); NL is optioneel. Lege teksten worden genegeerd en varianten per taal doorlopend genummerd.
- **Medewerker:** ziet standaard de taal van zijn profiel en kan wisselen naar elke taal waarin de post bestaat. Bij meerdere varianten kiest hij welke hij deelt; de gekozen tekst gaat naar het klembord of het deelvenster.
- **Terugval:** ontbreekt de gevraagde taal (bijvoorbeeld bij posts van vóór deze uitbreiding, die enkel Engels hebben), dan toont de app het Engels met een duidelijke melding, en anders de eerste beschikbare taal.
- **Preview in de juiste taal:** de deellink bevat `?lang=<taal>`, zodat de Open Graph-pagina de tekst in die taal toont. Een ongeldige taal valt terug op het Engels. De afbeelding en titel zijn niet vertaald: de titel is één voor alle talen.
- **Registratie:** `shares` bewaart de gekozen taal en variant (migratie `0004`).
- **Niet gebouwd:** een vertaling per titel, automatische vertaling met AI, een taal-specifiek beeld, posts achteraf bewerken.
- **Interfacetaal en posttaal zijn los van elkaar:** de interface volgt de taalkiezer bovenaan, de posttaal volgt het profiel van de medewerker en kan per post gewijzigd worden.

## Structuur van de code (overdracht)

- **Hybride in plaats van zuiver atomic design:** atoms, molecules, organisms en templates enkel voor herbruikbare UI (`ui/`); domeinonderdelen (een post, delen) staan per feature in `features/`. Zie [`architectuur.md`](architectuur.md) voor de redenering en de regels.
- **De regels worden afgedwongen met een test** (`tests/architecture.test.ts`): lagen kijken alleen naar beneden, features zijn onafhankelijk, geen relatieve imports tussen lagen. Zo blijft de structuur behouden als meerdere mensen eraan werken.
- **Herschikken zonder gedragswijziging:** alle bestaande tests en de manuele testprocedure bleven ongewijzigd. De enige logische wijzigingen zijn kleine extraheringen (`useCampaignList`, `useVariantSelection`, `hasCopy`) om pagina's dun te maken.
- **Niet gedaan:** componenttests en end-to-end-tests (zou een extra testbibliotheek vragen). Dat staat als logische vervolgstap in de architectuurdocumentatie.

## Opmaak en donkere modus

- **Bron:** de kleuren en het lettertype zijn gelezen uit de live pagina van locinox.com (berekende stijlen): oranje `#FF5000`, wit, gebroken wit `#FAF9F8`, lichtgrijs `#EDEDED`, grijze tekst, Open Sans, koppen in hoofdletters, rechte hoeken op vlakken en pilvormige knoppen. Enkel palet en stijl zijn overgenomen; **geen logo en geen foto's of teksten van Locinox**. De naam in de balk is een gewone tekstkop.
- **Design tokens:** alle kleuren staan als CSS-variabelen in `src/app/style.css` en zijn als Tailwind-klassen beschikbaar (`bg-surface`, `text-ink`, `bg-brand`, …). Componenten gebruiken geen losse kleuren meer. De huisstijl aanpassen is één blok wijzigen.
- **Donkere modus:** door mij ontworpen, want locinox.com heeft er geen. Hij volgt standaard de systeemvoorkeur en een knop in de balk laat de bezoeker kiezen; die keuze wordt onthouden. Een klein script in `index.html` zet het thema vóór het eerste scherm, zodat er geen lichte flits is.
- **Lettertype:** Open Sans via het npm-pakket `@fontsource-variable/open-sans` (OFL-licentie, onderhouden, lokaal meegeleverd en dus geen verzoeken naar Google Fonts). Enkel de Latijnse tekensets (EN, FR, DE, NL) worden geladen, samen ongeveer 84 kB.
- **Contrast (eerlijk):** witte tekst op `#FF5000` haalt ongeveer **3,3 : 1**, onder de 4,5 : 1 die WCAG AA voor gewone tekst vraagt. Locinox gebruikt zelf wit op oranje; ik behoud dat met een vetgedrukte, ruime knoptekst. Wie strikt aan AA wil voldoen, zet `--on-brand` op `#1a1a1a` (±6 : 1) of gebruikt een donkerder oranje; dat is één regel in `style.css`. Oranje als **tekst** op een lichte ondergrond gebruikt het donkerdere `#D94400` (±4,9 : 1).
- **Niet gedaan:** een volledig ontwerpsysteem, animaties en een gebruikersinstelling "volg systeem" als aparte derde stand.

## Bewust niet gebouwd

- Boostcampagnes, admin-dashboard en externe statistieken: alleen onderzocht, tenzij er tijd overblijft.
- Registratie, coins en beloningen, contentkalender, mails en ledenbeheer: buiten de opdracht.
- Echte LinkedIn-API-integratie: onderzoeken, niet bouwen.
