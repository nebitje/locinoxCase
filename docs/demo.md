# Demoscript (±5 minuten)

Doel: de volledige flow tonen, met de eigen uitbreiding, en eerlijk zijn over wat niet kan. Gebruik enkel testdata en **post niets**: sluit de LinkedIn-deeldialoog zonder te posten.

## Voorbereiding (vooraf)
- Open `https://locinox-case.vercel.app` in twee vensters (of een gewoon en een privévenster): één voor de admin, één voor een medewerker.
- Zorg voor testbestanden: een afbeelding (onder 5 MB), een korte video (MP4, onder 50 MB) en drie afbeeldingen voor de carrousel.
- Zet de telefoon klaar, ingelogd als medewerker.
- Leg bestaande testposts weg of houd ze bij de hand; verwijder rommel in het admin-overzicht.

## 1. Admin zet een post klaar (±2 min)
1. Log in als `admin@example.com`.
2. **New post**. Vul een titel in en voeg de afbeelding toe: de voorvertoning toont "Format: Image".
3. Toon de uitbreiding: de tabs **EN, FR, DE, NL**. Vul EN in, laat zien dat de knop uitgeschakeld blijft met de melding dat FR en DE ontbreken, vul FR en DE in en voeg bij FR een **tweede variant** toe. NL laat je leeg (optioneel).
4. Sla op. Je ziet de groene melding en de kaart.
5. (Snel) Maak een tweede post met drie afbeeldingen en toon het verplaatsen van de volgorde, en een derde met de video. Zeg dat de uploadregels op de server gecontroleerd worden: 5 MB per afbeelding, 50 MB per video, geen mengvorm.

## 2. Medewerker neemt de post over (±2 min)
1. Log in als `employee.fr@example.com` in het andere venster. De interface en de post staan in het Frans.
2. Open de post. Toon de **taalknoppen** (wissel naar DE) en de **variantkeuze**.
3. Desktop: klik **Delen op LinkedIn**. LinkedIn opent met de preview van de post en de melding dat de tekst gekopieerd is. Plak in het venster en sluit het **zonder te posten**.
4. Telefoon: open dezelfde post, tik op **Delen**. Het deelvenster van de telefoon opent met de afbeelding(en); kies LinkedIn en toon het concept, **zonder te posten**.

## 3. Eerlijk over de grenzen (±1 min)
- Op desktop gaat enkel een link naar LinkedIn; video en carrousel kunnen daar niet automatisch mee, op de telefoon wel.
- Getest op Android Chrome; iPhone nog niet.
- "Gedeeld" betekent "op delen geklikt". Echte LinkedIn-statistieken per campagne vragen een goedgekeurde API-app; zie `docs/linkedin-onderzoek.md`.

## Afsluiting
Wat ik als volgende zou bouwen: klik-tracking en een dashboard, posts bewerken, boostcampagnes en de LinkedIn-API-aanvraag.

## Als iets misgaat
- Preview ontbreekt in LinkedIn: ververs de link in de [Post Inspector](https://www.linkedin.com/post-inspector/) en probeer opnieuw.
- Niet ingelogd of fout wachtwoord: controleer het account en het wachtwoord uit je mail.
- Delen op desktop opent geen venster: laat de popup toe voor de site.
