import WebSocket, { WebSocketServer } from "ws"

export type WebSocketEventHandler = (data: object, server: WebSocketService, client: WebSocketClient) => void
type Sendable = string | any[] | object

export interface WebSocketService {
  on: (event: string, handler: WebSocketEventHandler) => void
  broadcast: (data: Sendable) => void
  listen: () => void
}

export interface WebSocketClient {
  send: (data: Sendable) => void
}

export interface WebSocketConfig {
  port: number
}

export function create(config: WebSocketConfig): WebSocketService {
  const server = new WebSocketServer(config)
  return new DefaultWebSocketService(server)
}

class DefaultWebSocketService implements WebSocketService {
  server: WebSocket.Server
  handlers: Map<string, WebSocketEventHandler>
  
  constructor(server: WebSocket.Server) {
    this.server = server
    this.handlers = new Map()
  }

  on(event: string, handler: WebSocketEventHandler) {
    this.handlers.set(event, handler)
  }
  
  broadcast(data: Sendable) {
    this.server.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        this.sendToClient(client, data)
      }
    })
  }

  listen() {
    this.server.on('connection', client => {

      const adaptedClient: WebSocketClient = {
        send: (data) => this.sendToClient(client, data),
      }

      client.on('error', console.error)
      client.on('message', rawData => {
        const stringData = rawData.toLocaleString()
        // TODO: add type safety
        const jsonData = JSON.parse(stringData)
        const event = jsonData.event
        this.handlers.get(event)?.(jsonData, this, adaptedClient)
      })
    })
  }

  private sendToClient(client: WebSocket, data: Sendable) {
    if (typeof data === 'object' && !Array.isArray(data)) {
      client.send(JSON.stringify(data))
      return
    }
    client.send(data)
  }
}