# LinkedIn-integratie en rapportering: onderzoek

Vraag uit de opdracht: welke gegevens over gedeelde posts kun je via officiële weg ophalen, en welke toegang of goedkeuring is daarvoor nodig? **Onderzocht, niet gebouwd.**

**Werkwijze en grenzen.** Ik heb enkel de officiële LinkedIn-documentatie op Microsoft Learn gelezen (stand 29 oktober 2026) en niets uitgeprobeerd, want alle API's hieronder vragen een goedgekeurde app. Wat ik zelf concludeer uit de bronnen, staat onder "Conclusies" en is als zodanig gemarkeerd. Of een toegangsaanvraag effectief goedgekeurd wordt, en hoelang dat duurt, is niet na te gaan in de documentatie.

## 1. Wat kan LinkedIn ons vertellen?

### a) Statistieken van de posts van een medewerker (Member Post Statistics)
- Endpoint `memberCreatorPostAnalytics`, permissie `r_member_postAnalytics`.
- Per post (`entity`) of samengeteld over alle posts van het lid (`me`).
- Metrics: impressies, bereikte leden, reshares, reacties, commentaren, bewaard, verstuurd, **klikken op links** (`LINK_CLICKS`), volgers gewonnen en profielweergaven. De laatste metrics staan in de versies vanaf april 2026.
- Per dag of in totaal. De bron zegt dat de data "best-effort accurate" is, niet bruikbaar voor facturatie, en dat `RESHARE`, `REACTION` en `COMMENT` in de samengetelde versie niet altijd overeenkomen met wat de interface toont.
- Het lid moet zelf toestemming geven (OAuth) en je ziet enkel de eigen posts van dat lid.

### b) Statistieken van een bedrijfspagina (Organization Share Statistics)
- Endpoint `organizationalEntityShareStatistics`, permissie `rw_organization_admin`, enkel voor wie **beheerder (ADMINISTRATOR)** van de pagina is.
- Per post of totaal: klikken, impressies, unieke impressies, likes, commentaren, shares en engagement. Alleen organisch verkeer, niet betaald.
- Enkel de **laatste 12 maanden** (rollend venster); tijdsreeksen per dag of maand zijn niet beschikbaar per individuele post.
- Dit is relevant voor **boostcampagnes**: we zien hoe de bedrijfspost zelf presteert, maar niet wie hem herpost heeft.

### c) Likes en commentaren (Social Actions)
- Lezen en maken van likes en commentaren op een post. Voor een lid is dat `w_member_social_feed`; **lezen namens een lid (`r_member_social_feed`) is beperkt tot geselecteerde ontwikkelaars**, voor een pagina is dat `r_organization_social_feed` (beheerdersrol vereist).
- Daarmee zou een knop "like en reageer op de bedrijfspost" technisch kunnen uitgevoerd worden door onze app. Voor de opdracht volstaat een knop die de post opent.

### d) Posten namens een lid (Share on LinkedIn)
- Via de UGC Posts API met `w_member_social` kan een app tekst, een artikel-link, een afbeelding of een video posten namens een lid. Het lid moet via OAuth toestemming geven. Limieten uit de bron: 150 aanvragen per lid per dag en 100.000 per app per dag.
- Pas als **onze app zelf post**, kennen we de post (URN) en kunnen we er statistieken bij zoeken. Zie de conclusies.

## 2. Welke toegang of goedkeuring is nodig?
- Het is een **gescreend product**: de *Community Management API*. Je solliciteert via het ontwikkelaarsportaal, eerst voor de **Development Tier** (beperkt aantal aanvragen), daarna voor de **Standard Tier**. Voor de Standard Tier vraagt LinkedIn een screencast die elk gevraagd gebruik toont.
- De bron noemt "Employee Advocacy" (inhoud laten herdelen via de profielen van medewerkers) en "Member Analytics" uitdrukkelijk als goedgekeurde gebruiksscenario's. Ons gebruik past dus binnen de bedoeling van het product.
- Per bron kan Development Tier enkel gevraagd worden met een **nieuwe app** die geen andere API-producten heeft. In de voorbeeldprocedure van de bron wordt zo'n nieuwe app aangemaakt met dezelfde bedrijfspagina als bij bestaande API-toegang; de exacte aanvraagprocedure voor Locinox heb ik niet doorlopen.
- `r_member_social` is een **gesloten permissie**: LinkedIn neemt daarvoor geen aanvragen meer aan.
- Marketing-API's zijn gebonden aan een versie (`Linkedin-Version`-header). Versie **202511 wordt op 16 november 2026 uitgefaseerd**; een nieuwe integratie moet dus een recente versie gebruiken.

## 3. Conclusies (mijn interpretatie van de bronnen)

1. **De deellink geeft geen terugkoppeling.** Omdat de medewerker via de LinkedIn-deeldialoog zelf post, weet onze app niet óf er gepost is en onder welke post. Wat we kunnen meten, is "een klik op delen" en, via onze eigen publieke postpagina, het aantal bezoeken vanaf LinkedIn.
2. **Statistieken per campagne en per medewerker zijn met de huidige aanpak niet te koppelen aan LinkedIn.** De per-post-statistieken vragen de URN van de post, en een lid de lijst van eigen posts laten ophalen vraagt de gesloten permissie `r_member_social`. De samengetelde variant (`me`) werkt wel, maar telt alle posts van dat lid, niet enkel de campagneposts.
3. **Wil Locinox echte shares, klikken en impressies per campagne**, dan moet de app de post zelf aanmaken via de API (met `w_member_social`), zodat de URN bekend is. Het vraagt dat elke medewerker zijn LinkedIn-account koppelt en dat Locinox de goedkeuring van LinkedIn krijgt. Of de ervaring op de telefoon even vlot blijft als het huidige deelvenster, is niet onderzocht.
4. **Voor boostcampagnes** is de rapportering op paginaniveau het haalbaarst: de beheerder van de Locinox-pagina kan met `rw_organization_admin` de statistieken van de bedrijfspost ophalen.
5. **Een privacykanttekening:** elk gekoppeld lid geeft toestemming voor het uitlezen van zijn statistieken. Locinox moet dat transparant voorleggen aan de medewerkers.

## 4. Voorstel voor de volgende stappen
1. **Nu al, zonder LinkedIn:** bezoeken aan `/p/<id>` per campagne, taal en medewerker tellen. Dat geeft interne "klikken" en een dashboard zonder goedkeuring.
2. Een nieuwe LinkedIn-app aanmaken bij de Locinox-pagina en de **Development Tier** van de Community Management API aanvragen.
3. Met die toegang een proef bouwen met `r_member_postAnalytics` voor één testmedewerker, en de paginastatistieken ophalen voor één bedrijfspost.
4. Pas daarna beslissen of de app zelf post, op basis van wat LinkedIn goedkeurt en wat de medewerkers aanvaarden.

## 5. Niet geverifieerd
- De deel-URL `https://www.linkedin.com/sharing/share-offsite/?url=…` en het gedrag ervan (enkel `url`) staan niet in de officiële documentatie die ik las; enkel de oudere Share Plugin wordt beschreven. Mijn gedrag is bevestigd door gebruik en door community-bronnen.
- De Post Inspector (`linkedin.com/post-inspector`) gebruikte ik in de praktijk om previews te controleren; ik vond hem niet beschreven in de officiële pagina's die ik las.
- Of herposten (reshare) via de API mogelijk is, heb ik niet nagezocht.
- Doorlooptijd en kans op goedkeuring van een aanvraag zijn onbekend.

## Bronnen (officieel)
- [Share on LinkedIn](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin): posten namens een lid, `w_member_social`, limieten.
- [Share Plugin](https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/plugins/share-plugin): de officiële deelknop.
- [Community Management: overzicht](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/community-management-overview): gebruiksscenario's, tiers en aanvraag.
- [Member Post Statistics](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/members/post-statistics): `memberCreatorPostAnalytics` en `r_member_postAnalytics`.
- [Organization Share Statistics](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/share-statistics): statistieken van een bedrijfspagina.
- [Network Update Social Actions](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/network-update-social-actions): likes en commentaren, en bijbehorende permissies.
