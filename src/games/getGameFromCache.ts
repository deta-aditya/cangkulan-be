import { Cache } from "../cache";
import { DbRowGame, DbRowGameSchema } from "./schemas";

export type GetGameFromCache = (cacheKey: string) => Promise<DbRowGame | null>;

export function createGetGameFromCache(cache: Cache): GetGameFromCache {
  return async (cacheKey) => {
    const result = await cache.get(cacheKey)
    if (!result.success) {
      return null
    }

    const gameFromCache = DbRowGameSchema.safeParse(result.value)
    if (gameFromCache.success) {
      return gameFromCache.data
    }
    return null
  }
}