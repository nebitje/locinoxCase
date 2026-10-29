// Maakt docs/uitleg.pdf uit docs/uitleg-pdf/uitleg.html met de browser die op de machine staat (Edge of Chrome).
// Gebruik: npm run pdf:uitleg   (of stel BROWSER_PATH in als je browser elders staat)
import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

const root = join(import.meta.dirname, '..')
const source = join(root, 'docs', 'uitleg-pdf', 'uitleg.html')
const target = join(root, 'docs', 'uitleg.pdf')

const candidates = [
  process.env.BROWSER_PATH,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
]
const browser = candidates.find((path): path is string => !!path && existsSync(path))
if (!browser) throw new Error('Geen Edge of Chrome gevonden. Stel BROWSER_PATH in.')
if (!existsSync(join(root, 'node_modules'))) throw new Error('Voer eerst npm install uit: het lettertype komt uit node_modules.')

const profile = mkdtempSync(join(tmpdir(), 'uitleg-pdf-'))
try {
  execFileSync(
    browser,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-pdf-header-footer',
      `--user-data-dir=${profile}`,
      '--virtual-time-budget=8000',
      `--print-to-pdf=${target}`,
      pathToFileURL(source).href,
    ],
    { stdio: 'ignore', timeout: 60_000 },
  )
} finally {
  rmSync(profile, { recursive: true, force: true })
}

console.log(`Gemaakt: ${target}`)
