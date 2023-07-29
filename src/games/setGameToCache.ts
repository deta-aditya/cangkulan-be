import { Cache } from "../cache";
import { DbRowGame } from "./schemas";

export type SetGameToCache = (cacheKey: string, value: DbRowGame) => Promise<void>;

export function createSetGameToCache(cache: Cache): SetGameToCache {
  return async (cacheKey: string, value: DbRowGame) => {
    await cache.set(cacheKey, value)
  }
}