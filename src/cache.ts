export interface Cache {
  get: (key: string) => Promise<GetCacheOperationResult>
  set: (key: string, value: unknown) => Promise<SetCacheOperationResult>
}

export type GetCacheOperationResult =
  | { success: true, value: unknown }
  | { success: false }

export type SetCacheOperationResult = { success: boolean }

export function create(): Cache {
  return new InMemoryCache()
}

class InMemoryCache implements Cache {
  values: Record<string, unknown> = {}

  async get(key: string) {
    return { success: key in this.values, value: this.values[key] }
  }

  async set(key: string, value: unknown) {
    this.values[key] = value
    return { success: true }
  }
}
