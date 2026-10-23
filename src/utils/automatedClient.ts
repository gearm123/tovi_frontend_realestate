/** True when this browser is a crawler or the headless browser Netlify uses to prerender. */
export function isAutomatedClient(): boolean {
  if (typeof navigator === 'undefined') return false
  if (navigator.webdriver) return true
  return /bot|crawl|slurp|spider|headless|prerender|facebookexternalhit|embedly|pinterest|slackbot|whatsapp|telegrambot|discordbot|applebot|petalbot|amazonbot|bytespider|gptbot|claudebot|anthropic|ccbot|google-inspectiontool/i.test(
    navigator.userAgent,
  )
}
