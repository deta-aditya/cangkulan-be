import WebSocket, { WebSocketServer } from "ws"
import { Result, isFailure } from "./result"
import { WebSocketHandlerError, sendError } from "./webSocketHandlerError"
import { Rooms } from "./rooms"
import { WebSocketHandlerResponse } from "./webSocketHandlerResponse"
import { newResponseHandlingResult, reduceResponseHandlingResult } from "./games/responseHandlingResult"

export type PureWebSocketEventHandler = (request: object) => Promise<Result<WebSocketHandlerResponse, WebSocketHandlerError>>
export type WebSocketEventHandler = (data: object, server: WebSocketService, client: WebSocketClient) => void
export type Sendable = string | any[] | object

// Temporary function. Later it should be the default logic for registering handler
export const adaptWebSocketHandlerFactory = (dependencies: {
  getRooms: () => Promise<Rooms>, 
  updateRooms: (rooms: Rooms) => Promise<void>,
}) => (handler: PureWebSocketEventHandler): WebSocketEventHandler => async (data, server, client) => {
  const { getRooms, updateRooms } = dependencies;
  const rooms = await getRooms()

  try {
    const result = await handler(data)
    if (isFailure(result)) {
      sendError(client, result.reason)
      return
    }

    const initialResult = newResponseHandlingResult(rooms);
    const responseHandlingResult = reduceResponseHandlingResult(initialResult, result.data, client)
  
    responseHandlingResult.command(server)
    updateRooms(responseHandlingResult.rooms)
  } catch (e) {
    // TODO: handle exceptions. make sure everything is handled 
  }
}


export interface WebSocketService {
  on: (event: string, handler: WebSocketEventHandler) => void
  onPure: (event: string, handler: PureWebSocketEventHandler) => void
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

export function create(dependencies: {config: WebSocketConfig, getRooms: () => Promise<Rooms>, updateRooms: (rooms: Rooms) => Promise<void>}): WebSocketService {
  const { config, getRooms, updateRooms } = dependencies;
  const server = new WebSocketServer(config)
  return new DefaultWebSocketService(server, getRooms, updateRooms)
}

class DefaultWebSocketService implements WebSocketService {
  server: WebSocket.Server
  pureHandlerAdapter: (handler: PureWebSocketEventHandler) => WebSocketEventHandler;

  // TODO: clients and its mutators should be its own class
  clients: Array<WebSocketClient>
  handlers: Map<string, WebSocketEventHandler>

  constructor(server: WebSocket.Server, getRooms: () => Promise<Rooms>, updateRooms: (rooms: Rooms) => Promise<void>) {
    this.server = server
    this.clients = []
    this.handlers = new Map()
    this.pureHandlerAdapter = adaptWebSocketHandlerFactory({ getRooms, updateRooms })
  }

  on(event: string, handler: WebSocketEventHandler) {
    this.handlers.set(event, handler)
  }

  onPure(event: string, handler: PureWebSocketEventHandler) {
    this.handlers.set(event, this.pureHandlerAdapter(handler));
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