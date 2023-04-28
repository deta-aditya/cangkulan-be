import { Request, Response } from "express"
import { FindGameById, FindGameByIdErrors } from "../games/findGameById";

const getGameHandler = (findGameById: FindGameById) => async (req: Request, res: Response) => {
  const { params } = req
  const gameId = Number(params.id)
  if (Number.isNaN(gameId)) {
    res.status(422).json({ message: 'id must be a number!' })
    return
  }

  try {
    const game = await findGameById(gameId)
    res.json(game)
  } catch (error) {
    const { status, message } = FindGameByIdErrors.when(error, {
      corruptGameData: (id, reason) => ({ status: 500, message: `Game with id ${id} is corrupt! Reason: ${reason}` }),
      gameNotFound: id => ({ status: 404, message: `Game with id ${id} does not exist!` }),
      databaseError: error => ({ status: 500, message: `Error in database: ${error.message}` }),
      _: () => ({ status: 500, message: `Unknown error: ${String(error)}` })
    })
    res.status(status).json({ message })
  }
}

export default getGameHandler
