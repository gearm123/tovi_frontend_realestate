import { getStore } from '@netlify/blobs'

interface RedirectSnapshot {
  body?: Record<string, string>
}

/** Sends an old magazine address to the article's current address. */
export default async function articleRedirects(request: Request, context: { next: () => Promise<Response> }) {
  const url = new URL(request.url)
  const match = url.pathname.match(/^\/magazine\/([^/]+)\/?$/)
  if (!match) return context.next()
  const slug = decodeURIComponent(match[1]).toLowerCase()
  try {
    const snapshot = (await getStore({ name: 'catalog-cache', consistency: 'strong' }).get(
      'article-redirects',
      { type: 'json' },
    )) as RedirectSnapshot | null
    const target = snapshot?.body?.[slug]
    if (target && target !== slug) {
      const location = new URL(`/magazine/${target}${url.search}`, url.origin)
      return new Response(null, {
        status: 301,
        headers: {
          location: location.toString(),
          'cache-control': 'public, max-age=0, must-revalidate',
          'netlify-cdn-cache-control': 'public, durable, s-maxage=3600, must-revalidate',
          'netlify-cache-tag': 'articles',
        },
      })
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : 'Could not read article redirects')
  }
  return context.next()
}

export const config = { path: '/magazine/*' }
