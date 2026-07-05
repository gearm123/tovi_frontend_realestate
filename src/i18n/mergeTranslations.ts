type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

function mergeSection<T extends object>(base: T, patch?: DeepPartial<T>): T {
  if (!patch) return base
  const result = { ...base, ...patch } as T

  for (const key of Object.keys(patch) as (keyof T)[]) {
    const patchValue = patch[key]
    const baseValue = base[key]

    if (
      patchValue &&
      typeof patchValue === 'object' &&
      !Array.isArray(patchValue) &&
      baseValue &&
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue)
    ) {
      result[key] = mergeSection(baseValue, patchValue as DeepPartial<typeof baseValue>)
    }
  }

  return result
}

export function mergeTranslations<T extends object>(base: T, patch: DeepPartial<T>): T {
  return mergeSection(base, patch)
}
