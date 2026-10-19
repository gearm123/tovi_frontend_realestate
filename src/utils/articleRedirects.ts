/** Old magazine address -> the article's current address. */
export function articleRedirectMap(
  articles: Array<{ slug: string; previousSlugs?: string[] }>,
): Record<string, string> {
  const live = new Set(articles.map((article) => article.slug))
  const redirects: Record<string, string> = {}
  for (const article of articles) {
    for (const previous of article.previousSlugs ?? []) {
      if (!previous || previous === article.slug || live.has(previous)) continue
      redirects[previous] = article.slug
    }
  }
  return redirects
}
