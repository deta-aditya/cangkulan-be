import { z } from "zod";
import { Cache } from "../cache";
import { WebSocketEventHandler } from "../websocket";
import { CacheError, CorruptDataError, InternalError, NotFoundError, ParseRequestError, UnknownError, sendError } from "../webSocketHandlerError";
import { FindGameById, FindGameByIdErrors } from "../games/findGameById";
import { Receptionist } from "../receptionist";

import * as WebSocketEvents from "../webSocketEvents";

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
    game.removePlayer(playerLeaveRequest.playerId)

    const cacheSetResult = await cache.set(gameCacheKey, game.forDbRow)
    if (!cacheSetResult.success) {
      sendError(client, CacheError(`Can't set value of key ${gameCacheKey}`))
      return
    }

    const announcementBody = WebSocketEvents.playerLeft({
      gameId: playerLeaveRequest.gameId,
      playerId: playerLeaveRequest.playerId,
    })

    const roomName = gameCacheKey
    receptionist.sendToRoom(roomName, announcementBody)
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

export default playerLeave
