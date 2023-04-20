import { Request, Response } from "express"
import { Database, EmptyRowError } from "../database"

interface Game {
  id: number
  config: {
    cardsPerPlayer: number;
    numberOfPlayers: number;
  }
}

const getGameHandler = (database: Database) => async (req: Request, res: Response) => {
  const { params } = req
  const gameId = Number(params.id)

  try {
    const result = await database.queryOne<Game, [number]>(
      'SELECT id, config FROM games WHERE id = $1', 
      [gameId],
    )
    res.status(200).json(result)
  } catch (error) {
    if (error instanceof EmptyRowError) {
      res.status(404).json({ message: `Game with id ${gameId} does not exist!` })
      return
    }
    res.status(500).json(error)
    return;
  }
}

export default getGameHandler
