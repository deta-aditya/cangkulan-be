import WebSocket, { WebSocketServer } from "ws"

export type WebSocketEventHandler = (data: object, server: WebSocketService, client: WebSocketClient) => void
export type Sendable = string | any[] | object

export interface WebSocketService {
  on: (event: string, handler: WebSocketEventHandler) => void
  broadcast: (data: Sendable) => void
  broadcastWhen: (condition: (client: WebSocketClient) => boolean, data: Sendable) => void
  listen: () => void
}

export interface WebSocketClient {
  id: number
  isOpen: () => boolean
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

  // TODO: clients and its mutators should be its own class
  clients: Array<WebSocketClient>
  handlers: Map<string, WebSocketEventHandler>

  constructor(server: WebSocket.Server) {
    this.server = server
    this.clients = []
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

  broadcastWhen(condition: (client: WebSocketClient) => boolean, data: Sendable) {
    this.clients.forEach(client => {
      if (condition(client) && client.isOpen()) {
        client.send(data)
      }
    })
  }

  listen() {
    this.server.on('connection', client => {
      const isClientsEmpty = this.clients.length === 0
      const nextClientId = () => this.clients[this.clients.length - 1].id + 1
      const clientId = isClientsEmpty ? 0 : nextClientId()

      const adaptedClient: WebSocketClient = {
        id: clientId,
        isOpen: () => client.readyState === WebSocket.OPEN,
        send: (data) => this.sendToClient(client, data),
      }
      this.clients.push(adaptedClient)

      client.on('error', console.error)
      client.on('message', rawData => {
        const stringData = rawData.toLocaleString()
        // TODO: add type safety
        const jsonData = JSON.parse(stringData)
        const event = jsonData.event
        this.handlers.get(event)?.(jsonData.data, this, adaptedClient)
      })

      client.on('close', () => {
        this.clients = this.clients.filter(client => client.id !== clientId)
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