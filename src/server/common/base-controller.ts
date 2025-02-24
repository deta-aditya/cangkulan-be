import type { ZodSchema } from "npm:zod";
import type { HttpResponse } from "@/framework/http.ts";
import type { ErrorHandler } from "@/server/common/error-handler.ts";
import type { SchemaParser } from "@/server/common/schema-parser.ts";

export class BaseController {
  constructor(
    private schemaParser: SchemaParser,
    private errorHandler: ErrorHandler,
  ) {}

  parseSchema<T>(schema: ZodSchema<T>) {
    return this.schemaParser.ofSchema(schema);
  }

  handleError(error: unknown): HttpResponse {
    return this.errorHandler.handle(error);
  }
}
