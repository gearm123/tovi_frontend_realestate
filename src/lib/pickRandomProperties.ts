import type { Property } from '../types/property'

export function pickRandomProperties(source: Property[], count: number): Property[] {
  if (count <= 0 || source.length === 0) return []
  if (source.length <= count) return [...source]

  const pool = [...source]
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    const current = pool[i]
    const swap = pool[j]
    if (current === undefined || swap === undefined) continue
    pool[i] = swap
    pool[j] = current
  }

  return pool.slice(0, count)
}
