export function scrollPageTo(top: number) {
  const root = document.documentElement
  root.style.setProperty('scroll-behavior', 'auto', 'important')
  root.scrollTop = top
  document.body.scrollTop = top
  root.style.removeProperty('scroll-behavior')
}

export function scrollPageToTop() {
  scrollPageTo(0)
}
