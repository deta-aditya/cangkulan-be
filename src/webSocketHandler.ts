import { ZodType, infer as ZodInfer, ZodError } from "zod";
import { WebSocketClient } from "./websocket";
import { Result } from "./result";

type WebSocketHandlerError =
  | { kind: 'parse-object-error', error: ZodError }

function parseObjectError(error: ZodError) {
  return { kind: 'parse-object-error', error } as const
}

type ParseObjectSuccessData<T> = ZodInfer<ZodType<T>>

export function parseObject<T>(validator: ZodType<T>, data: object): Result<ParseObjectSuccessData<T>, WebSocketHandlerError> {
  const result = validator.safeParse(data);
  if (result.success) {
    return Result.success(result.data);
  }
  return Result.failure(parseObjectError(result.error));
}

export function sendError(client: WebSocketClient) {
  return function (errorValue: WebSocketHandlerError) {
    const issueMessages = errorValue.error.issues
      .map(issue => `${issue.path[0]} - ${issue.message}`);
    const message = issueMessages[0]

    client.send({
      error: true,
      kind: 'Error!',
      message,
    })
  }
}