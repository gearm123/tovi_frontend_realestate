const AUTOMATED_AGENT =
  /bot|crawl|slurp|spider|headless|prerender|facebookexternalhit|embedly|pinterest|slackbot|whatsapp|telegrambot|discordbot|applebot|petalbot|amazonbot|bytespider|gptbot|claudebot|anthropic|ccbot|google-inspectiontool/i

/** Crawlers do not need the homepage video. A saved copy must not be reused for a person. */
export default async function heroVideo(request: Request, context: { next: () => Promise<Response> }) {
  const agent = request.headers.get('user-agent') ?? ''
  if (!AUTOMATED_AGENT.test(agent)) return context.next()
  return new Response(null, {
    status: 204,
    headers: {
      'cache-control': 'private, no-store',
      'netlify-cdn-cache-control': 'no-store',
      vary: 'user-agent',
      'x-robots-tag': 'noindex',
    },
  })
}

export const config = { path: '/assets/properhero.mp4' }
