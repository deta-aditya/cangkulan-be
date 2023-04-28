import { z } from "zod";
import { WebSocketEventHandler } from "../websocket";
import { CorruptDataError, CacheError, ParseRequestError, sendError, NotFoundError, InternalError, UnknownError } from "../webSocketHandler";
import { Cache } from "../cache";
import { Receptionist } from "../receptionist";
import { FindGameById, FindGameByIdErrors } from "../games/findGameById";

import * as WebSocketEvents from "../webSocketEvents";

const PlayerJoinRequestSchema = z.object({
  gameId: z.number(),
  playerId: z.number(),
})

const playerJoin = (cache: Cache, receptionist: Receptionist, findGameById: FindGameById): WebSocketEventHandler => async (data, server, client) => {
  const dataParseResult = PlayerJoinRequestSchema.safeParse(data)
  if (!dataParseResult.success) {
    sendError(client, ParseRequestError(dataParseResult.error))
    return
  }

  const playerJoinRequest = dataParseResult.data
  const gameId = playerJoinRequest.gameId
  const gameCacheKey = String(playerJoinRequest.gameId)

  try {
    const game = await findGameById(gameId)
    game.addPlayer(playerJoinRequest.gameId)

    const cacheSetResult = await cache.set(gameCacheKey, game.forDbRow)
    if (!cacheSetResult.success) {
      sendError(client, CacheError(`Can't set value of key ${gameCacheKey}`))
      return
    }

    const roomName = gameCacheKey
    receptionist.setGuestToRoom(roomName, client)

    const announcementBody = WebSocketEvents.playerJoined({
      gameId: playerJoinRequest.gameId,
      playerId: playerJoinRequest.playerId,
      canStartGame: game.canStartGame,
    })
    receptionist.sendToRoom(roomName, announcementBody)
  } catch (error) {
    // TODO: find out how to merge "when"s. In the future, there will be a lot of "when"s!
    FindGameByIdErrors.when(error, {
      corruptGameData: (id, reason) => sendError(client, CorruptDataError(`Corrupt game of id ${id} due to ${reason}`)),
      gameNotFound: id => sendError(client, NotFoundError('Game', id)),
      databaseError: error => sendError(client, InternalError(error)),
      _: () => sendError(client, UnknownError(error instanceof Error ? error.stack || error.message : String(error)))
    })
  }
}

export default playerJoin
