import { Request, Response } from "express"

import { Database } from "../database"
import { ValidationResult, invalid, isKeyNumber, valid } from "../validator"
import { DEFAULT_GAME_STATE, Game } from "../games/schemas"
import { Cache } from "../cache"

const createGameHandler = (cache: Cache, database: Database) => async (req: Request, res: Response) => {
  const { body } = req
  const validationResult = validateCreateGameRequest(body)
  if (!validationResult.isValid) {
    res.status(400).send({ message: validationResult.message })
    return
  }

  try {
    // TODO: need to think about the encapsulation/invariant to prevent invalid data from being inserted to DB and stored in cache
    const databaseResult = await database.executeOne<{ id: number }, [GameConfig, Game['state']]>(
      `INSERT INTO games (config, state) VALUES (json($1), json($2)) RETURNING id`,
      [validationResult.value, DEFAULT_GAME_STATE],
    )

    const gameCacheKey = String(databaseResult.id)
    const setCacheResult = await cache.set(gameCacheKey, {
      config: validationResult.value,
      state: {
        joinedPlayers: [],
      }
    })
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

interface GameConfig {
  cardsPerPlayer: number;
  numberOfPlayers: number;
}

const validateCreateGameRequest = (body: object): ValidationResult<GameConfig> => {
  if (!isKeyNumber('cardsPerPlayer', body)) {
    return invalid('"cardsPerPlayer" must be a number');
  }

  if (!isKeyNumber('numberOfPlayers', body)) {
    return invalid('"numberOfPlayers" must be a number');
  }

  if (52 - body.cardsPerPlayer * body.numberOfPlayers < body.cardsPerPlayer) {
    return invalid('Deck is too few. Consider reducing "cardsPerPlayer"')
  }

  return valid(body);
}

export default createGameHandler