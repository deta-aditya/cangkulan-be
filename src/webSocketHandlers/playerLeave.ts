import { z } from "zod";
import { Cache } from "../cache";
import { WebSocketEventHandler } from "../websocket";
import { CacheError, CorruptDataError, InternalError, NotFoundError, ParseRequestError, UnknownError, sendError } from "../webSocketHandler";
import { FindGameById, FindGameByIdErrors } from "../games/findGameById";
import { Receptionist } from "../receptionist";

import * as WebSocketEvents from "../webSocketEvents";
import { Game } from "../games/schemas";

const PlayerLeaveRequestSchema = z.object({
  gameId: z.number(),
  playerId: z.number(),
})

// TODO: this code has too much duplicated funcionality to playerJoin. Figure out how to extract the similarities
const playerLeave = (cache: Cache, receptionist: Receptionist, findGameById: FindGameById): WebSocketEventHandler => async (data, server, client) => {
  const dataParseResult = PlayerLeaveRequestSchema.safeParse(data)
  if (!dataParseResult.success) {
    sendError(client, ParseRequestError(dataParseResult.error))
    return
  }

  const playerLeaveRequest = dataParseResult.data
  const gameId = playerLeaveRequest.gameId
  const gameCacheKey = String(playerLeaveRequest.gameId)

  try {
    const game = await findGameById(gameId)
    const newGameState = removePlayerFromState(playerLeaveRequest.playerId, game)

    const cacheSetResult = await cache.set(gameCacheKey, newGameState)
    if (!cacheSetResult.success) {
      sendError(client, CacheError(`Can't set value of key ${gameCacheKey}`))
      return
    }

    const announcementBody = WebSocketEvents.playerLeft({
      gameId: playerLeaveRequest.gameId,
      playerId: playerLeaveRequest.playerId,
    })
    receptionist.sendToRoom(gameCacheKey, announcementBody)

    const roomName = gameCacheKey
    receptionist.removeGuestFromRoom(roomName, client)
  } catch (error) {
    FindGameByIdErrors.when(error, {
      corruptGameData: (id, reason) => sendError(client, CorruptDataError(`Corrupt game of id ${id} due to ${reason}`)),
      gameNotFound: id => sendError(client, NotFoundError('Game', id)),
      databaseError: error => sendError(client, InternalError(error)),
      _: () => sendError(client, UnknownError(error instanceof Error ? error.stack || error.message : String(error)))
    })
  }
}

// TODO: this kind of function should be carefully put to prevent invalid state
const removePlayerFromState = (playerId: number, game: Game) => {
  const newGame: Game = {
    ...game,
    state: {
      ...game.state,
      joinedPlayers: game.state.joinedPlayers
        .filter(joinedPlayerId => joinedPlayerId !== playerId)
    }
  }

  return newGame
}

export default playerLeave
