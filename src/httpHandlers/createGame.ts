import { Request, Response } from "express"
import { Database } from "../database"
import { ValidationResult, invalid, isKeyNumber, valid } from "../validator"

const createGameHandler = (database: Database) => async (req: Request, res: Response) => {
  const { body } = req
  const validationResult = validateCreateGameRequest(body)
  if (!validationResult.isValid) {
    res.status(400).send({ message: validationResult.message })
    return
  }

  try {
    const result = await database.executeOne<{ id: number }, [GameConfig]>(
      'INSERT INTO games (config) VALUES (json($1)) RETURNING id', 
      [validationResult.value],
    )
    res.status(201).json(result)
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