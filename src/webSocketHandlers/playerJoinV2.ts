import { z } from "zod";
import { PureFindGameById } from "../games/findGameByIdV2";
import { UpdateGame } from "../games/updateGame";
import { PureWebSocketEventHandler } from "../websocket";
import { NotFoundError, ParseRequestError } from "../webSocketHandlerError";
import { Failure, Success, isFailure } from "../result";
import { addPlayer, canStartGame } from "../games/gameV2";

import * as WebSocketEvents from "../webSocketEvents";
import { Broadcast, Register, Sequence } from "../webSocketHandlerResponse";

const PlayerJoinRequestSchema = z.object({
  gameId: z.number(),
  playerId: z.number(),
})

export const purePlayerJoin = (dependencies: { 
  findGameById: PureFindGameById, 
  updateGame: UpdateGame, 
}): PureWebSocketEventHandler => async (request) => {
  const { findGameById, updateGame } = dependencies;
  const parseRequestResult = PlayerJoinRequestSchema.safeParse(request)
  if (!parseRequestResult.success) {
    return Failure(ParseRequestError(parseRequestResult.error))
  }

  const parsedRequest = parseRequestResult.data
  const findGameResult = await findGameById(parsedRequest.gameId)
  if (isFailure(findGameResult)) {
    return Failure(NotFoundError('Game', parsedRequest.gameId))
  }
  
  const game = findGameResult.data
  const newGame = addPlayer(game, parsedRequest.playerId)
  await updateGame(game.id, newGame)

  const message = WebSocketEvents.playerJoined({
    gameId: parsedRequest.gameId,
    playerId: parsedRequest.playerId,
    canStartGame: canStartGame(newGame),
  })

  const roomId = String(parsedRequest.gameId)
  return Success(
    Sequence(
      [
        Register(roomId),
        Broadcast(roomId, message),
      ]
    )
  )
}