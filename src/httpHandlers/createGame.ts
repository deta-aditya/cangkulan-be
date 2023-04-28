import { Request, Response } from "express"

import { Database } from "../database"
import { Game, GameConfigSchema } from "../games/schemas"
import { GameFactory } from "../games/gameFactory"
import { Cache } from "../cache"
import { isFailure } from "../result"

const CreateGameRequestSchema = GameConfigSchema

const createGameHandler = (cache: Cache, database: Database, gameFactory: GameFactory) => async (req: Request, res: Response) => {
  const bodyParseResult = CreateGameRequestSchema.safeParse(req.body)
  if (!bodyParseResult.success) {
    res.status(400).send({ message: bodyParseResult.error.message })
    return
  }

  const newGameCreationResult = gameFactory.fromConfig(bodyParseResult.data)
  if (isFailure(newGameCreationResult)) {
    res.status(400).send({ message: 'Deck is too few. Consider reducing "cardsPerPlayer"' })
    return
  }
  const newGame = newGameCreationResult.data

  try {
    const databaseResult = await database.executeOne<{ id: number }, [Game['config'], Game['state']]>(
      `INSERT INTO games (config, state) VALUES (json($1), json($2)) RETURNING id`,
      [newGame.forDbRow.config, newGame.forDbRow.state],
    )

    const gameCacheKey = String(databaseResult.id)
    const setCacheResult = await cache.set(gameCacheKey, newGame.forDbRow)
    if (!setCacheResult.success) {
      res.status(500).send({ message: 'Error when interacting with cache!' })
      return
    }

    res.status(201).json(databaseResult)
  } catch (error) {
    res.status(500).json(error)
    return;
  }
}

export default createGameHandler