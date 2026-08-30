/**
 * Reorder each listing gallery so images[0] (cover) prefers living spaces
 * and demotes bathrooms / showers / toilets.
 *
 * Usage: node scripts/select-featured-images.mjs [--dry-run] [--limit N]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { RawImage, pipeline } from '@xenova/transformers'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const listingsPath = path.join(root, 'src/data/importedListings.json')
const cacheDir = path.join(__dirname, 'cache')
const scoreCachePath = path.join(cacheDir, 'featured-image-scores.json')
const reportPath = path.join(cacheDir, 'featured-image-report.json')

const LABELS = [
  'living room sofa seating area',
  'open plan living dining room',
  'modern kitchen interior',
  'bedroom with bed',
  'bathroom shower toilet',
  'balcony terrace outdoor view',
  'building exterior facade',
  'hallway corridor staircase',
]

const SCORE = {
  'living room sofa seating area': 100,
  'open plan living dining room': 95,
  'balcony terrace outdoor view': 70,
  'modern kitchen interior': 65,
  'building exterior facade': 55,
  'bedroom with bed': 45,
  'hallway corridor staircase': 20,
  'bathroom shower toilet': -100,
}

const args = new Set(process.argv.slice(2))
const dryRun = args.has('--dry-run')
const limitIdx = process.argv.indexOf('--limit')
const limit = limitIdx >= 0 ? Number(process.argv[limitIdx + 1]) || 0 : 0

function publicPath(urlPath) {
  return path.join(root, 'public', urlPath.replace(/^\//, '').replace(/\//g, path.sep))
}

async function loadClassifier() {
  console.log('Loading CLIP model…')
  return pipeline('zero-shot-image-classification', 'Xenova/clip-vit-base-patch32')
}

async function classifyImage(classifier, absPath, scoreCache) {
  const key = absPath.replace(/\\/g, '/')
  if (scoreCache[key]) return scoreCache[key]

  try {
    const image = await RawImage.read(absPath)
    const results = await classifier(image, LABELS)
    const byLabel = Object.fromEntries(results.map((r) => [r.label, r.score]))
    const top = results[0]?.label ?? 'hallway corridor staircase'
    const confidence = results[0]?.score ?? 0
    const base = SCORE[top] ?? 0
    const bathroomPenalty = (byLabel['bathroom shower toilet'] ?? 0) > 0.22 ? -80 : 0
    const livingBonus =
      (byLabel['living room sofa seating area'] ?? 0) * 25 +
      (byLabel['open plan living dining room'] ?? 0) * 20

    const entry = {
      top,
      confidence: Number(confidence.toFixed(4)),
      score: Number((base + livingBonus + bathroomPenalty).toFixed(2)),
      byLabel,
    }
    scoreCache[key] = entry
    return entry
  } catch (error) {
    const entry = {
      top: 'hallway corridor staircase',
      confidence: 0,
      score: -40,
      byLabel: {},
      error: String(error?.message ?? error),
    }
    scoreCache[key] = entry
    return entry
  }
}

function reorderImages(images, scored) {
  if (images.length <= 1) return { images, changed: false, reason: 'single' }

  const ranked = images
    .map((src, index) => ({ src, index, ...scored[index] }))
    .sort((a, b) => b.score - a.score || a.index - b.index)

  const best = ranked[0]
  const current = scored[0]
  const currentIsBathroom =
    current.top === 'bathroom shower toilet' || current.score < 0
  const bestIsMuchBetter = best.score >= current.score + 15
  const shouldMove =
    best.index !== 0 && (currentIsBathroom || (bestIsMuchBetter && best.score >= 50))

  if (!shouldMove) {
    return {
      images,
      changed: false,
      reason: currentIsBathroom ? 'no-better-candidate' : 'cover-ok',
      cover: images[0],
      coverLabel: current.top,
      coverScore: current.score,
    }
  }

  const next = [best.src, ...images.filter((_, i) => i !== best.index)]
  return {
    images: next,
    changed: true,
    reason: currentIsBathroom ? 'demote-bathroom' : 'prefer-living',
    from: images[0],
    fromLabel: current.top,
    fromScore: current.score,
    to: best.src,
    toLabel: best.top,
    toScore: best.score,
  }
}

async function main() {
  fs.mkdirSync(cacheDir, { recursive: true })
  const listings = JSON.parse(fs.readFileSync(listingsPath, 'utf8'))
  const scoreCache = fs.existsSync(scoreCachePath)
    ? JSON.parse(fs.readFileSync(scoreCachePath, 'utf8'))
    : {}

  const classifier = await loadClassifier()
  const report = []
  let changedCount = 0
  const target = limit > 0 ? listings.slice(0, limit) : listings

  for (let i = 0; i < target.length; i += 1) {
    const listing = target[i]
    const images = Array.isArray(listing.images) ? [...listing.images] : []
    if (images.length === 0) continue

    process.stdout.write(`\r[${i + 1}/${target.length}] ${listing.id.slice(0, 48).padEnd(48)}`)

    const scored = []
    const scoreOne = async (src) => {
      const abs = publicPath(src)
      if (!fs.existsSync(abs)) {
        return {
          top: 'hallway corridor staircase',
          confidence: 0,
          score: -50,
          byLabel: {},
        }
      }
      return classifyImage(classifier, abs, scoreCache)
    }

    // Fast path: keep covers that already look like living spaces.
    scored[0] = await scoreOne(images[0])
    const coverLooksStrong =
      scored[0].score >= 70 &&
      (scored[0].top === 'living room sofa seating area' ||
        scored[0].top === 'open plan living dining room')

    if (coverLooksStrong) {
      report.push({
        id: listing.id,
        changed: false,
        reason: 'cover-ok',
        cover: images[0],
        coverLabel: scored[0].top,
      })
      if ((i + 1) % 5 === 0) {
        fs.writeFileSync(scoreCachePath, JSON.stringify(scoreCache))
      }
      continue
    }

    for (let j = 1; j < images.length; j += 1) {
      scored[j] = await scoreOne(images[j])
    }

    const result = reorderImages(images, scored)
    report.push({
      id: listing.id,
      changed: result.changed,
      reason: result.reason,
      from: result.from,
      fromLabel: result.fromLabel,
      to: result.to,
      toLabel: result.toLabel,
      cover: result.cover ?? result.to ?? images[0],
      coverLabel: result.coverLabel ?? result.toLabel,
    })

    if (result.changed) {
      changedCount += 1
      listing.images = result.images
      listing.image = result.images[0]
    }

    if ((i + 1) % 5 === 0) {
      fs.writeFileSync(scoreCachePath, JSON.stringify(scoreCache))
    }
  }

  console.log(`\nChanged covers: ${changedCount}/${target.length}`)
  fs.writeFileSync(scoreCachePath, JSON.stringify(scoreCache, null, 2))
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  console.log(`Report: ${reportPath}`)

  if (!dryRun) {
    fs.writeFileSync(listingsPath, `${JSON.stringify(listings, null, 2)}\n`)
    console.log(`Updated ${listingsPath}`)
  } else {
    console.log('Dry run — listings file not written')
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
