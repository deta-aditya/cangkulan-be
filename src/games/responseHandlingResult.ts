import { Rooms, addClientToRoom, isClientInRoom } from "../rooms"
import { Sequence, WebSocketHandlerResponse, isResponseListEmpty, unprependResponseList } from "../webSocketHandlerResponse"
import { WebSocketClient, WebSocketService } from "../websocket"

const EMPTY_COMMAND = (_: WebSocketService) => {}

type ResponseHandlingResult = {
  rooms: Rooms,
  command: (server: WebSocketService) => void
}

export function newResponseHandlingResult(rooms: Rooms): ResponseHandlingResult {
  return { rooms, command: EMPTY_COMMAND }
}

export function setRooms(responseHandlingResult: ResponseHandlingResult, rooms: Rooms) {
  return { ...responseHandlingResult, rooms }
}

export function setCommand(responseHandlingResult: ResponseHandlingResult, command: ResponseHandlingResult['command']) {
  return { ...responseHandlingResult, command }
}

export function reduceResponseHandlingResult(result: ResponseHandlingResult, response: WebSocketHandlerResponse, client: WebSocketClient): ResponseHandlingResult {
  switch (response.kind) {
    case 'sequence':
      return reduceSequence(result, response, client)
    case 'register':
      return reduceRegister(result, response, client)
    case 'broadcast':
      return reduceBroadcast(result, response)
  }
}

export function reduceBroadcast(result: ResponseHandlingResult, response: Extract<WebSocketHandlerResponse, { kind: 'broadcast' }>): ResponseHandlingResult {
  return setCommand(result, (server) => {
    server.broadcastWhen(client => isClientInRoom(result.rooms, response.room, client.id), response.message)
  })
}

export function reduceSequence(result: ResponseHandlingResult, response: Extract<WebSocketHandlerResponse, { kind: 'sequence' }>, client: WebSocketClient) {
  if (isResponseListEmpty(response)) return result
  const [responseToHandle, theRestOfTheResponses] = unprependResponseList(response)
  const resultFromThisResponse = reduceResponseHandlingResult(result, responseToHandle, client)
  const newResponse = Sequence(theRestOfTheResponses)
  return reduceResponseHandlingResult(resultFromThisResponse, newResponse, client)
}

export function reduceRegister(result: ResponseHandlingResult, response: Extract<WebSocketHandlerResponse, { kind: 'register' }>, client: WebSocketClient) {
  return setRooms(result, addClientToRoom(result.rooms, response.room, client.id))
}
