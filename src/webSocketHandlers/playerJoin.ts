import { z } from "zod";
import { WebSocketEventHandler } from "../websocket";
import { CorruptDataError, CacheError, ParseRequestError, sendError, NotFoundError, InternalError, UnknownError } from "../webSocketHandler";
import { Cache } from "../cache";
import { Receptionist } from "../receptionist";
import { FindGameById, FindGameByIdErrors } from "../games/findGameById";
import { Game } from "../games/schemas";

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
    const newGameState = addPlayerToState(playerJoinRequest.playerId, game)

    const cacheSetResult = await cache.set(gameCacheKey, newGameState)
    if (!cacheSetResult.success) {
      sendError(client, CacheError(`Can't set value of key ${gameCacheKey}`))
      return
    }

    const roomName = gameCacheKey
    receptionist.setGuestToRoom(roomName, client)

    const canStartGame = newGameState.config.numberOfPlayers === newGameState.state.joinedPlayers.length;
    const announcementBody = WebSocketEvents.playerJoined({
      gameId: playerJoinRequest.gameId,
      playerId: playerJoinRequest.playerId,
      canStartGame,
    })
    receptionist.sendToRoom(gameCacheKey, announcementBody)
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

// TODO: this kind of function should be carefully put to prevent invalid state
const addPlayerToState = (playerId: number, game: Game) => {
  const isPlayerJoined = game.state.joinedPlayers.some(joinedPlayerId => playerId === joinedPlayerId);
  if (isPlayerJoined) {
    return game
  }

  const newGameState: Game = {
    ...game,
    state: {
      ...game.state,
      joinedPlayers: [
        ...game.state.joinedPlayers,
        playerId,
      ]
    }
  }

  return newGameState
}

export default playerJoin
