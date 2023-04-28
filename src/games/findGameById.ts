import { Cache } from "../cache"
import { Database, EmptyRowError } from "../database"
import { rejectify } from "../promise";
import { Game } from "./game";
import { GameFactory } from "./gameFactory";
import { DbRowGameSchema, DbRowGame } from "./schemas";

import * as Errors from "./errors";

const CorruptGameData = rejectify(Errors.CorruptGameData)
const GameNotFound = rejectify(Errors.GameNotFound)
const DatabaseError = rejectify(Errors.DatabaseError)

export type FindGameById = (id: number) => Promise<Game>

// TODO: just like handler functions, this has a lot of noise. Figure out to reduce it so it only contains the important business logic
const findGameById = (database: Database, cache: Cache, gameFactory: GameFactory) => async (id: number): Promise<Game> => {
  const gameCacheKey = String(id)
  const cacheGetResult = await cache.get(gameCacheKey)
  if (cacheGetResult.success) {
    const gameFromCache = DbRowGameSchema.safeParse(cacheGetResult.value)
    if (gameFromCache.success) {
      return gameFactory.fromDbRow(gameFromCache.data)
    }
  }

  try {
    const result = await database.queryOne<DbRowGame, [number]>(
      'SELECT id, config, state FROM games WHERE id = $1',
      [id],
    )
    const gameFromDatabase = DbRowGameSchema.safeParse(result)
    if (gameFromDatabase.success) {
      return gameFactory.fromDbRow(gameFromDatabase.data)
    }
    return CorruptGameData(id, gameFromDatabase.error.message)
  } catch (error) {
    if (error instanceof EmptyRowError) {
      return GameNotFound(id)
    }
    return DatabaseError(error as Error)
  }
}

export const FindGameByIdErrors = {
  when: Errors.when,
}

export function resolve(database: Database, cache: Cache, gameFactory: GameFactory): FindGameById {
  return findGameById(database, cache, gameFactory);
}
