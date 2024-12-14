import { Response } from "express";
import { Responder } from "@/core/common/responder";
import { ERROR_CODE, getStatusCode } from "../error-code";
import { parseFromError } from "../error-response-body";

export class ExpressResponder implements Responder {
  constructor(
    private response: Response,
  ) {}

  static of(response: Response) {
    return new ExpressResponder(response);
  }

  success(body: Record<string, unknown>): void {
    this.response.status(200).json(body);
  }

  failure(error: unknown): void {
    const body = parseFromError(error);
    const statusCode = getStatusCode(body.code);

    if (body.internalMessage) {
      console.error(body.internalMessage);
    }

    this.response.status(statusCode).json({
      code: ERROR_CODE.unknownError,
      message: body.message,
    });
  }
}
