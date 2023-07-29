import { Database } from "../database";
import { DbRowGame, DbRowGameSchema } from "./schemas";

export type GetGameFromDb = (id: number) => Promise<DbRowGame | null>;

export function createGetGameFromDb(database: Database): GetGameFromDb {
  return async (id: number) => {
    const result = await database.queryOne('SELECT id, config, state FROM games WHERE id = $1', [id]);
    const gameFromDatabase = DbRowGameSchema.safeParse(result)
    if (gameFromDatabase.success) {
      return gameFromDatabase.data
    }
    return null
  }
}