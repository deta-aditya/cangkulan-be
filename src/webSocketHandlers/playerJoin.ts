import { z } from "zod";
import { WebSocketEventHandler, WebSocketService } from "../websocket";
import { parseObject, sendError } from "../webSocketHandler";

const PlayerJoinRequestSchema = z.object({
  gameId: z.number(),
  playerId: z.number(),
})

type PlayerJoinRequest = z.infer<typeof PlayerJoinRequestSchema>

const playerJoin: WebSocketEventHandler = (data, server, client) => {
  parseObject(PlayerJoinRequestSchema, data)
    .when({
      success: announcePlayer(server),
      failure: sendError(client)
    })
}

const announcePlayer = (server: WebSocketService) => (data: PlayerJoinRequest) => {
  server.broadcast({
    event: 'player-joined-in',
    message: `Player ${data.playerId} has joined!`,
    data,
  })
}

export default playerJoin
