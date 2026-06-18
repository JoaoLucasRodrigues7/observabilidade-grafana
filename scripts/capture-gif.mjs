// Captura uma sequência de frames de um slide animado e monta um GIF.
// Uso: node scripts/capture-gif.mjs <numeroDoSlide> <segundos> <urlBase>
// Requer: servidor do Slidev rodando (pnpm dev) e ffmpeg instalado.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, rmSync, mkdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { chromium } from 'playwright-chromium'

const slide = process.argv[2] ?? '6'
const seconds = Number(process.argv[3] ?? 6)
const baseUrl = process.argv[4] ?? 'http://localhost:3030'
const fps = 20
const url = `${baseUrl}/#/${slide}`

const frameDir = mkdtempSync(join(tmpdir(), 'slide-frames-'))
const outDir = join(process.cwd(), 'exports')
mkdirSync(outDir, { recursive: true })
const outGif = join(outDir, `slide-${slide}.gif`)

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 })
await page.goto(url, { waitUntil: 'networkidle' })
// espera o SVG da animação aparecer
await page.waitForSelector('.svg-flow, svg', { timeout: 15000 }).catch(() => {})
await page.waitForTimeout(800)

const total = seconds * fps
console.log(`Capturando ${total} frames (${seconds}s @ ${fps}fps) do slide ${slide}...`)
for (let i = 0; i < total; i++) {
  await page.screenshot({ path: join(frameDir, `f-${String(i).padStart(4, '0')}.png`) })
  await page.waitForTimeout(1000 / fps)
}
await browser.close()

console.log('Montando GIF com ffmpeg...')
// palette de alta qualidade para o GIF
const palette = join(frameDir, 'palette.png')
execFileSync('ffmpeg', ['-y', '-framerate', String(fps), '-i', join(frameDir, 'f-%04d.png'),
  '-vf', 'palettegen=stats_mode=diff', palette], { stdio: 'inherit' })
execFileSync('ffmpeg', ['-y', '-framerate', String(fps), '-i', join(frameDir, 'f-%04d.png'),
  '-i', palette, '-lavfi', 'paletteuse=dither=bayer:bayer_scale=3', '-loop', '0', outGif],
  { stdio: 'inherit' })

rmSync(frameDir, { recursive: true, force: true })
console.log(`\n✅ GIF salvo em: ${outGif}`)
