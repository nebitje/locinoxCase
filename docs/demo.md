# Demoscript (±6 minuten)

Doel: de volledige flow tonen, met de eigen uitbreiding, en eerlijk zijn over wat niet kan. Gebruik enkel testdata en **post niets**: sluit de LinkedIn-deeldialoog zonder te posten.

## Voorbereiding (vooraf)
- Open `https://locinox-case.vercel.app` in twee vensters (of een gewoon en een privévenster): één voor de admin, één voor een medewerker.
- De demoposts staan er al: voer zo nodig `npm run seed:demo` uit (vijf posts met rechtenvrije Unsplash-foto's, in EN, FR, DE en NL). Verwijder de oude "testpost"-posts uit het admin-overzicht.
- Voor het aanmaken van een nieuwe post: kies foto's uit `scripts/demo-assets/` (elk onder 5 MB). Er zit **geen video** in de demo; toon de video-upload enkel als je zelf een korte MP4 (onder 50 MB) klaar hebt.
- Zet de telefoon klaar, ingelogd als medewerker.

## 1. Admin zet een post klaar (±2 min)
1. Log in als `admin@example.com`.
2. **New post**. Vul een titel in en voeg de afbeelding toe: de voorvertoning toont "Format: Image".
3. Toon de uitbreiding: de tabs **EN, FR, DE, NL**. Vul EN in, laat zien dat de knop uitgeschakeld blijft met de melding dat FR en DE ontbreken, vul FR en DE in en voeg bij FR een **tweede variant** toe. NL laat je leeg (optioneel).
4. Sla op. Je ziet de groene melding en de kaart.
5. (Snel) Toon een carrousel: kies drie foto's en laat zien hoe je de volgorde verplaatst. Zeg dat de uploadregels op de server gecontroleerd worden: 5 MB per afbeelding, 50 MB per video, geen mengvorm.

## 2. Medewerker neemt de post over (±2 min)
1. Log in als `employee.fr@example.com` in het andere venster. De interface en de post staan in het Frans.
2. Open de post. Toon de **taalknoppen** (wissel naar DE) en de **variantkeuze**.
3. Desktop: klik **Delen op LinkedIn**. LinkedIn opent met de preview van de post en de melding dat de tekst gekopieerd is. Plak in het venster en sluit het **zonder te posten**.
4. Telefoon: open dezelfde post, tik op **Delen**. Het deelvenster van de telefoon opent met de afbeelding(en); kies LinkedIn en toon het concept, **zonder te posten**.

## 3. Het ontwerp (±1 min)
- Wissel het thema met de knop in de balk: de donkere modus onthult zich als een cirkel vanaf de knop.
- Beweeg over een kaart (lift en zoom) en ververs de lijst om de laadskeletons te tonen.
- Open `/styleguide`: de tokens en bouwstenen op voorbeelddata.
- Noem kort de structuur voor de overdracht (`docs/architectuur.md`): de lagen `app`, `pages`, `features`, `ui` en `shared`, bewaakt door een test.

## 4. Eerlijk over de grenzen (±1 min)
- Op desktop gaat enkel een link naar LinkedIn; video en carrousel kunnen daar niet automatisch mee, op de telefoon wel.
- Getest op Android Chrome; iPhone nog niet.
- "Gedeeld" betekent "op delen geklikt". Echte LinkedIn-statistieken per campagne vragen een goedgekeurde API-app; zie `docs/linkedin-onderzoek.md`.

## Afsluiting
Wat ik als volgende zou bouwen: klik-tracking en een dashboard, posts bewerken, boostcampagnes en de LinkedIn-API-aanvraag.

## Als iets misgaat
- Preview ontbreekt in LinkedIn: ververs de link in de [Post Inspector](https://www.linkedin.com/post-inspector/) en probeer opnieuw.
- Niet ingelogd of fout wachtwoord: controleer het account en het wachtwoord uit je mail.
- Delen op desktop opent geen venster: laat de popup toe voor de site.
