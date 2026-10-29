// Inhoud van de demoposts. Alle teksten zijn fictief; de foto's zijn rechtenvrij (zie demo-assets/CREDITS.md).

export type DemoLanguage = 'en' | 'fr' | 'de' | 'nl'

export interface DemoPost {
  /** Vast id, zodat het seedscript opnieuw uitgevoerd kan worden zonder dubbele posts. */
  id: string
  title: string
  /** Unsplash-foto-id's in de volgorde van de slides. */
  photos: string[]
  /** Per taal één of meer varianten. */
  copy: Record<DemoLanguage, string[]>
}

export const demoPosts: DemoPost[] = [
  {
    id: '00000000-0000-4000-8000-00000000d001',
    title: 'Secure by design',
    photos: ['8yYAaguVDgY'],
    copy: {
      en: [
        'A good gate does not shout about security. It simply works, every day, in every weather. Reliable hardware is what makes the difference. #gates #security',
        'Behind every gate that closes smoothly there is hardware that was chosen with care. Quality you do not notice is quality that works. #gates #quality',
      ],
      fr: [
        'Un bon portail ne crie pas sa sécurité. Il fonctionne, simplement, chaque jour et par tous les temps. #portails #sécurité',
      ],
      de: [
        'Ein gutes Tor schreit nicht nach Sicherheit. Es funktioniert einfach, jeden Tag und bei jedem Wetter. #tore #sicherheit',
      ],
      nl: [
        'Een goede poort roept niet dat hij veilig is. Hij werkt gewoon, elke dag en bij elk weer. #poorten #veiligheid',
      ],
    },
  },
  {
    id: '00000000-0000-4000-8000-00000000d002',
    title: 'Details that matter',
    photos: ['iHNGF-5Dyn8'],
    copy: {
      en: ['Small details decide whether a lock lasts for years or for months. Take a closer look at the craft behind it. #hardware #craftsmanship'],
      fr: ['Ce sont les petits détails qui décident si une serrure dure des années ou quelques mois. #quincaillerie #savoirfaire'],
      de: ['Kleine Details entscheiden, ob ein Schloss Jahre oder nur Monate hält. Ein genauer Blick auf das Handwerk lohnt sich. #beschläge #handwerk'],
      nl: ['Kleine details bepalen of een slot jaren meegaat of maar een paar maanden. #hang-en-sluitwerk #vakmanschap'],
    },
  },
  {
    id: '00000000-0000-4000-8000-00000000d003',
    title: 'Home sweet home',
    photos: ['xpDHTc-pkog'],
    copy: {
      en: ['A home starts at the gate. Welcome visitors, keep the rest out. #home #fencing'],
      fr: ['Une maison commence au portail. Accueillez vos visiteurs, gardez les autres dehors. #maison #clôture'],
      de: ['Ein Zuhause beginnt am Tor. Besucher willkommen heißen, alle anderen draußen halten. #zuhause #zaun'],
      nl: ['Een thuis begint aan de poort. Bezoekers welkom, de rest buiten. #thuis #omheining'],
    },
  },
  {
    id: '00000000-0000-4000-8000-00000000d004',
    title: 'Gates around the world',
    photos: ['3pagydwiHC4', 'WTreUo2YFGw', 'eAdq5k2-YoI'],
    copy: {
      en: [
        'Black steel, green steel, a simple fence: every gate tells its own story. Swipe through three of our favourites. #gates #design',
        'Three gates, three styles, one thing in common: they all have to open and close reliably. Swipe to see them. #gates #reliability',
      ],
      fr: ['Acier noir, acier vert, simple clôture : chaque portail raconte sa propre histoire. Faites défiler nos trois préférés. #portails #design'],
      de: ['Schwarzer Stahl, grüner Stahl, ein schlichter Zaun: Jedes Tor erzählt seine eigene Geschichte. Wischen Sie durch drei Favoriten. #tore #design'],
      nl: ['Zwart staal, groen staal, een eenvoudig hek: elke poort vertelt zijn eigen verhaal. Swipe door drie favorieten. #poorten #design'],
    },
  },
  {
    id: '00000000-0000-4000-8000-00000000d005',
    title: 'Close-up: metal and lock',
    photos: ['wT24_J8pdp4', 'tEP6TI8pXW4', 'gBnHMsAOWrs'],
    copy: {
      en: ['Pattern, lock and handle: three close-ups of the materials that keep things closed. #materials #detail'],
      fr: ['Motif, serrure et poignée : trois gros plans des matériaux qui gardent tout fermé. #matériaux #détail'],
      de: ['Muster, Schloss und Griff: drei Nahaufnahmen der Materialien, die alles verschlossen halten. #materialien #detail'],
      nl: ['Patroon, slot en handgreep: drie close-ups van de materialen die alles gesloten houden. #materialen #detail'],
    },
  },
]
