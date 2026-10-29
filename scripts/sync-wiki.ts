// Zet de documentatie uit de repository (README en docs/) om naar pagina's voor de GitHub-wiki en publiceert ze.
//   npm run wiki:build   maakt de pagina's in .wiki-build/ (niets wordt gepubliceerd)
//   npm run wiki:sync    bouwt, kloont de wiki, zet de pagina's erin en pusht
// De wiki is een kopie: wijzig de bronbestanden in de repository en voer het script opnieuw uit.
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, posix } from 'node:path'

const root = join(import.meta.dirname, '..')
const REPO = 'nebitje/locinoxCase'
const BLOB = `https://github.com/${REPO}/blob/main/`
const TREE = `https://github.com/${REPO}/tree/main/`

/** Bronbestand (vanaf de repo-root) naar wikipagina. De volgorde is die van de zijbalk. */
const PAGES: [source: string, page: string, title: string][] = [
  ['docs/uitleg.md', 'Uitleg', 'Uitleg bij het prototype'],
  ['docs/demo.md', 'Demo', 'Demoscript'],
  ['docs/beslissingen.md', 'Beslissingen', 'Beslissingen'],
  ['docs/architectuur.md', 'Architectuur', 'Architectuur'],
  ['docs/linkedin-onderzoek.md', 'LinkedIn-onderzoek', 'LinkedIn-onderzoek'],
  ['docs/testprocedure.md', 'Testprocedure', 'Testprocedure'],
  ['docs/opdracht.md', 'Opdracht', 'De opdracht'],
]
const HOME = ['README.md', 'Home'] as const

const pageOf = new Map<string, string>([[HOME[0], HOME[1]], ...PAGES.map(([source, page]) => [source, page] as [string, string])])

/** Herschrijft links: tussen documenten wordt dit een wikilink, naar andere bestanden een link naar de repository. */
function rewriteLinks(markdown: string, source: string): string {
  return markdown.replace(/\]\(([^)\s]+)\)/g, (whole, target: string) => {
    if (/^(https?:|mailto:|#)/.test(target)) return whole
    const [path = '', hash = ''] = target.split(/(?=#)/)
    const resolved = posix.normalize(posix.join(posix.dirname(source), path))
    const page = pageOf.get(resolved)
    if (page) return `](${page}${hash})`
    const isFile = /\.[a-z0-9]+$/i.test(posix.basename(resolved))
    return `](${isFile ? BLOB : TREE}${resolved.replace(/\/$/, '')}${hash})`
  })
}

function build(outDir: string) {
  rmSync(outDir, { recursive: true, force: true })
  mkdirSync(outDir, { recursive: true })

  const notice = (source: string) =>
    `> Deze pagina wordt gegenereerd uit [\`${source}\`](${BLOB}${source}) in de repository. Wijzig het bronbestand, niet de wiki.\n\n`

  for (const [source, page] of [[HOME[0], HOME[1]] as [string, string], ...PAGES.map(([s, p]) => [s, p] as [string, string])]) {
    const text = readFileSync(join(root, source), 'utf8').replace(/\r\n/g, '\n')
    writeFileSync(join(outDir, `${page}.md`), notice(source) + rewriteLinks(text, source))
  }

  const sidebar = [
    '**[Locinox Advocacy](Home)**',
    '',
    ...PAGES.map(([, page, title]) => `- [${title}](${page})`),
    '',
    `[Prototype](https://locinox-case.vercel.app) · [Repository](https://github.com/${REPO}) · [Uitleg als PDF](${BLOB}docs/uitleg.pdf)`,
    '',
  ].join('\n')
  writeFileSync(join(outDir, '_Sidebar.md'), sidebar)

  return readdirSync(outDir).sort()
}

function git(cwd: string, ...args: string[]) {
  return execFileSync('git', args, { cwd, encoding: 'utf8' }).trim()
}

const outDir = join(root, '.wiki-build')
const files = build(outDir)
console.log(`Gebouwd in .wiki-build/: ${files.join(', ')}`)

if (process.argv.includes('--push')) {
  const work = mkdtempSync(join(tmpdir(), 'wiki-'))
  try {
    git(root, 'ls-remote', `https://github.com/${REPO}.wiki.git`)
  } catch {
    throw new Error('De wiki bestaat nog niet. Zet Wikis aan in Settings en maak eerst één pagina op GitHub (dan bestaat de wiki-repository).')
  }
  try {
    git(tmpdir(), 'clone', '--quiet', `https://github.com/${REPO}.wiki.git`, work)
    for (const name of readdirSync(work)) if (name.endsWith('.md')) rmSync(join(work, name))
    for (const name of files) writeFileSync(join(work, name), readFileSync(join(outDir, name)))

    git(work, 'add', '-A')
    if (!git(work, 'status', '--porcelain')) {
      console.log('De wiki is al up-to-date.')
    } else {
      const sha = git(root, 'rev-parse', '--short', 'HEAD')
      const name = git(root, 'config', 'user.name')
      const email = git(root, 'config', 'user.email')
      git(work, '-c', `user.name=${name}`, '-c', `user.email=${email}`, 'commit', '--quiet', '-m', `docs: wiki gesynchroniseerd met de repository (${sha})`)
      git(work, 'push', '--quiet', 'origin', 'HEAD')
      console.log('De wiki is bijgewerkt.')
    }
  } finally {
    rmSync(work, { recursive: true, force: true })
  }
}
