import { ZodError } from "zod";
import { WebSocketClient } from "./websocket";

export type WebSocketHandlerError =
  | ParseRequestError
  | CorruptDataError
  | CacheError
  | NotFoundError
  | InternalError
  | UnknownError

interface ParseRequestError {
  kind: 'parse-request-error';
  error: ZodError;
}

interface CorruptDataError {
  kind: 'corrupt-data-error';
  reason: string;
}

interface CacheError {
  kind: 'cache-error';
  reason: string;
}

interface NotFoundError {
  kind: 'not-found-error';
  dataType: string;
  id: number;
}

interface InternalError {
  kind: 'internal-error';
  error: Error;
}

interface UnknownError {
  kind: 'unknown-error';
  reason: string;
}

export function ParseRequestError(error: ZodError): WebSocketHandlerError {
  return { kind: 'parse-request-error', error }
}

export function CorruptDataError(reason: string): WebSocketHandlerError {
  return { kind: 'corrupt-data-error', reason }
}

export function CacheError(reason: string): WebSocketHandlerError {
  return { kind: 'cache-error', reason }
}

export function NotFoundError(dataType: string, id: number): WebSocketHandlerError {
  return { kind: 'not-found-error', dataType, id }
}

export function InternalError(error: Error): WebSocketHandlerError {
  return { kind: 'internal-error', error }
}

export function UnknownError(reason: string): WebSocketHandlerError {
  return { kind: 'unknown-error', reason }
}

export function sendError(client: WebSocketClient, errorValue: WebSocketHandlerError) {
  const message = (() => {
    switch (errorValue.kind) {
      case 'cache-error':
        return `Error when interacting with cache. Reason: ${errorValue.reason}`
      case 'parse-request-error':
        return processZodError(errorValue.error)
      case 'corrupt-data-error':
        return `Data is corrupt. Reason: ${errorValue.reason}`
      case 'not-found-error':
        return `${errorValue.dataType} data with id ${errorValue.id} is not found!`
      case 'internal-error':
        return `Internal error: ${errorValue.error.message}`
      case 'unknown-error':
        return `Unknown error: ${errorValue.reason}`
    }
  })()

  client.send({
    error: true,
    kind: errorValue.kind,
    message,
  })
}

function processZodError(zodError: ZodError) {
  const issueMessages = zodError.issues
    .map(issue => `${issue.path[0]} - ${issue.message}`);
  return issueMessages[0]
}
