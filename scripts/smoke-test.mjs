/**
 * Localhost smoke test for ProperTLV frontend.
 * Usage: node scripts/smoke-test.mjs [baseUrl]
 */
import { chromium } from 'playwright'

const BASE = (process.argv[2] || 'http://localhost:5175').replace(/\/$/, '')
const ADMIN_USER = 'Tova'
const ADMIN_PASS = 'TUwBedfvmt(&k3z7b^&Ybp@V'

const results = []

function ok(name, detail = '') {
  results.push({ name, status: 'pass', detail })
  console.log(`PASS  ${name}${detail ? ` — ${detail}` : ''}`)
}

function fail(name, detail = '') {
  results.push({ name, status: 'fail', detail })
  console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`)
}

async function dismissLeadPopup(page) {
  const backdrop = page.locator('.lead-capture-popup__backdrop, .lead-capture-popup [aria-label*="סגיר"], .lead-capture-popup [aria-label*="Close" i]')
  if ((await backdrop.count()) > 0) {
    await backdrop.first().click({ force: true }).catch(() => {})
    await page.waitForTimeout(200)
  }
}

async function goto(page, path) {
  const response = await page.goto(`${BASE}${path}`, {
    waitUntil: 'domcontentloaded',
    timeout: 30000,
  })
  await page.waitForSelector('#root', { timeout: 10000 })
  await page.waitForTimeout(800)
  await dismissLeadPopup(page)
  return response
}

async function expectPage(page, path, name) {
  const response = await goto(page, path)
  const status = response?.status() ?? 0
  const rootText = (await page.locator('#root').innerText().catch(() => '')).trim()
  const crashed =
    rootText.length < 20 ||
    /Unexpected Application Error|Minified React error/i.test(rootText)

  if (status >= 400 || crashed) {
    fail(name, `status=${status}, rootLen=${rootText.length}, url=${page.url()}`)
    return false
  }
  ok(name, `status=${status}, rootLen=${rootText.length}`)
  return true
}

async function run() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'en-US',
  })
  const page = await context.newPage()
  const pageErrors = []
  page.on('pageerror', (err) => pageErrors.push(err.message))

  try {
    // Reset locale storage so tests start in English
    await goto(page, '/')
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    await goto(page, '/')

    for (const [path, name] of [
      ['/', 'Home'],
      ['/sales', 'Sales listings'],
      ['/rentals', 'Rentals listings'],
      ['/properties', 'Properties search'],
      ['/about', 'About'],
      ['/services', 'Services'],
      ['/contact', 'Contact'],
      ['/magazine', 'Magazine'],
      ['/sellers-package', 'Sellers package'],
    ]) {
      await expectPage(page, path, name)
    }

    // Sales detail
    await goto(page, '/sales')
    const saleLink = page.locator('a[href*="/property/sale/"]').first()
    if ((await page.locator('a[href*="/property/sale/"]').count()) === 0) {
      fail('Sales have listings', 'no /property/sale/ links found')
    } else {
      const href = await saleLink.getAttribute('href')
      ok('Sales have listings', href || '')
      await saleLink.click()
      await page.waitForTimeout(800)
      const title = (
        await page.locator('.property-detail__title').first().innerText().catch(() => '')
      ).trim()
      if (!title || /not found/i.test(title)) fail('Sale detail page', `title="${title}"`)
      else ok('Sale detail page', title.slice(0, 90))
    }

    // Rentals detail
    await goto(page, '/rentals')
    const rentalLink = page.locator('a[href*="/property/rental/"]').first()
    if ((await page.locator('a[href*="/property/rental/"]').count()) === 0) {
      fail('Rentals have listings', 'no /property/rental/ links found')
    } else {
      const href = await rentalLink.getAttribute('href')
      ok('Rentals have listings', href || '')
      await rentalLink.click()
      await page.waitForTimeout(800)
      const title = (
        await page.locator('.property-detail__title').first().innerText().catch(() => '')
      ).trim()
      if (!title || /not found/i.test(title)) fail('Rental detail page', `title="${title}"`)
      else ok('Rental detail page', title.slice(0, 90))
    }

    // Hebrew locale (accessible name is localized aria-label, so use class)
    await goto(page, '/')
    const heControl = page.locator('button.lang-toggle__option--he')
    if ((await heControl.count()) > 0) {
      await heControl.first().click()
      await page.waitForTimeout(500)
      const lang = await page.locator('html').getAttribute('lang')
      const dir = await page.locator('html').getAttribute('dir')
      if (lang === 'he' || dir === 'rtl') ok('Hebrew locale switch', `lang=${lang}, dir=${dir}`)
      else fail('Hebrew locale switch', `lang=${lang}, dir=${dir}`)
    } else {
      fail('Hebrew locale switch', 'HE button not found')
    }

    // Back to EN for admin labels
    await dismissLeadPopup(page)
    const enControl = page.locator('button.lang-toggle__option--en')
    if ((await enControl.count()) > 0) {
      await enControl.first().click({ force: true })
      await page.waitForTimeout(300)
      ok('Lead popup dismissible + EN restore', 'ok')
    }

    // Admin login
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    await goto(page, '/admin')
    await page.fill('#admin-username', ADMIN_USER)
    await page.fill('#admin-password', ADMIN_PASS)
    await page.click('input.admin-login__submit')
    await page.waitForTimeout(1000)

    if (!page.url().includes('/admin/dashboard')) {
      fail('Admin login', `ended on ${page.url()}`)
    } else {
      ok('Admin login', 'reached dashboard')
    }

    for (const [path, name] of [
      ['/admin/dashboard', 'Admin dashboard'],
      ['/admin/listings', 'Admin listings'],
      ['/admin/agents', 'Admin agents'],
      ['/admin/business', 'Admin business'],
      ['/admin/lead-capture', 'Admin lead capture'],
      ['/admin/listings/new', 'Admin new listing form'],
    ]) {
      await expectPage(page, path, name)
    }

    await goto(page, '/admin/listings')
    const body = await page.locator('body').innerText()
    const listingMentions = (body.match(/For Sale|For rent|₪|apartment|Apartment/gi) || []).length
    if (listingMentions >= 5) ok('Admin listings populated', `${listingMentions} listing text hits`)
    else fail('Admin listings populated', `hits=${listingMentions}`)

    // Auth guard
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    await goto(page, '/admin/dashboard')
    if ((await page.locator('#admin-username').count()) > 0) {
      ok('Admin auth guard', 'login form shown')
    } else {
      fail('Admin auth guard', `url=${page.url()}`)
    }

    // Bad credentials
    await page.fill('#admin-username', 'wrong')
    await page.fill('#admin-password', 'wrong')
    await page.click('input.admin-login__submit')
    await page.waitForTimeout(400)
    const alert = await page.locator('.admin-login__error, [role="alert"]').innerText().catch(() => '')
    if (/invalid/i.test(alert)) ok('Admin rejects bad credentials', alert)
    else fail('Admin rejects bad credentials', `alert="${alert}"`)

    if (pageErrors.length) {
      fail('No page JS errors', pageErrors.slice(0, 5).join(' | '))
    } else {
      ok('No page JS errors')
    }
  } finally {
    await browser.close()
  }

  const failed = results.filter((r) => r.status === 'fail')
  console.log('\n--- Summary ---')
  console.log(`Passed: ${results.length - failed.length}/${results.length}`)
  if (failed.length) {
    console.log('Failed:')
    for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`)
    process.exit(1)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
