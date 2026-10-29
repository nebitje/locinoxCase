# Manuele testprocedure: kernflow

Doel: controleren dat de kernflow van begin tot einde werkt. Gebruik enkel testdata en post niets op echte kanalen: laat de LinkedIn-dialoog open zonder te posten.

Voorbereiding: migraties `0001` tot `0003` uitgevoerd in Supabase, `npm run seed` gedraaid, wachtwoorden uit `.env`.

## 1. Admin zet posts klaar
Account: `admin@example.com`.

| Stap | Verwacht resultaat |
|---|---|
| Inloggen | Je komt op `/admin`; de lijst is leeg of toont bestaande posts. |
| *New post*: titel, tekst en één afbeelding | Voorvertoning verschijnt, formaat "Image", knop actief. Na opslaan: groene melding en de kaart. |
| *New post* met één video (MP4, onder 50 MB) | Formaat "Video"; na opslaan staat de kaart in de lijst. |
| *New post* met 3 afbeeldingen, volgorde wijzigen | Formaat "Carousel"; de kaart toont "Carousel · 3" en de eerste afbeelding is de eerste in de volgorde. |
| Foutgevallen: PDF, afbeelding boven 5 MB, afbeelding plus video, meer dan 10 afbeeldingen | Duidelijke melding en de knop blijft uitgeschakeld. |

## 2. Medewerker neemt een post over
Accounts: `employee.en@example.com`, `employee.fr@example.com`, `employee.de@example.com`.

| Stap | Verwacht resultaat |
|---|---|
| Inloggen | Je komt op `/posts` met de kaarten van de admin; de interface staat in de taal van het account. |
| `/admin` openen | Je wordt teruggestuurd naar `/posts`. |
| Kaart openen | Detailpagina met het beeld (video speelt, carrousel scrolt), titel en tekst. |

## 3. Delen
Doe dit op desktop **en** op een telefoon.

| Situatie | Stap | Verwacht resultaat |
|---|---|---|
| Desktop | *Delen op LinkedIn* | Nieuw tabblad met de LinkedIn-deeldialoog en een preview van de post. Groene melding: tekst gekopieerd. In het LinkedIn-venster plakken (Ctrl+V) plaatst de tekst. **Niet posten.** |
| Desktop, één afbeelding | *Afbeelding kopiëren* | Melding "Image copied"; plakken in de LinkedIn-editor toont de afbeelding. |
| Mobiel (Android Chrome, iOS Safari) | *Delen* | Het deelvenster van het toestel opent met de bestanden. Kies LinkedIn: het concept bevat de media. De tekst is ingevuld of staat op het klembord. **Niet posten.** |
| Mobiel | Deelvenster sluiten | Geen foutmelding. |
| Beide | In Supabase de tabel `shares` bekijken | Er staat een rij per klik, met de juiste methode (`linkedin` of `native`). |

Noteer per toestel wat wel en niet werkt in [`docs/beslissingen.md`](beslissingen.md).
