import { WebSocketEventHandler } from "../websocket";

const checkInHandler: WebSocketEventHandler = (data, server) => {
  // TODO: add type safety
  if ('playerId' in data && data.playerId) {
    server.broadcast({
      message: `Player ${data.playerId} has joined!`
    })
  }
}

export default checkInHandler
