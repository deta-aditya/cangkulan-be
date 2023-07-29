import { Failure, Result, Success } from "../result";
import { Game } from "./schemas";
import * as Errors from './errors';
import { GetGameFromDb } from "./getGameFromDb";
import { GetGameFromCache } from "./getGameFromCache";
import { SetGameToCache } from "./setGameToCache";

export type PureFindGameById = (id: number) => Promise<Result<Game, Errors.FindGameByIdError>>

export const pureFindGameById = (dependencies: { 
  getGameFromDb: GetGameFromDb, 
  setGameToCache: SetGameToCache, 
  getGameFromCache: GetGameFromCache,
}): PureFindGameById => async (id) => {
  const { getGameFromCache, setGameToCache, getGameFromDb } = dependencies;
  const gameCacheKey = String(id)
  const gameFromCache = await getGameFromCache(gameCacheKey)
  if (gameFromCache !== null) {
    return Success(gameFromCache)
  }

  const gameFromDb = await getGameFromDb(id);
  if (gameFromDb !== null) {
    await setGameToCache(gameCacheKey, gameFromDb)
    return Success(gameFromDb)
  }
  return Failure(Errors.GameNotFound(id)) 
}
