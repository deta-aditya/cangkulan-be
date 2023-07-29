import { Sendable } from "./websocket";

export type WebSocketHandlerResponse = 
  | { kind: 'broadcast', room: string, message: Sendable } 
  | { kind: 'register', room: string }
  | WebSocketHandlerResponseSequence

type WebSocketHandlerResponseSequence = {
  kind: 'sequence';
  responseList: WebSocketHandlerResponse[];
};

export function Sequence(responseList: WebSocketHandlerResponse[]): WebSocketHandlerResponse {
  return { kind: 'sequence', responseList: responseList }
}

export function Register(room: string): WebSocketHandlerResponse {
  return { kind: 'register', room }
}

export function Broadcast(room: string, message: Sendable): WebSocketHandlerResponse {
  return { kind: 'broadcast', room, message }
}

export function unprependResponseList(response: WebSocketHandlerResponseSequence) {
  const [responseToHandle, ...theRestOfTheResponses] = response.responseList
  return [responseToHandle, theRestOfTheResponses] as const
}

export function isResponseListEmpty(response: WebSocketHandlerResponseSequence) {
  return response.responseList.length === 0
}