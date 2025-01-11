import type { ZodType } from "npm:zod";
import { Result } from "@/core/common/result.ts";
import { CoreError } from "@/core/common/core-error.ts";

class SchemaParserReadyForParse<T> {
  constructor(
    private schema: ZodType<T>,
  ) {}

  parse(data: unknown): Result<T, CoreError> {
    const parsedRequest = this.schema.safeParse(data);
    if (parsedRequest.success) {
      return Result.ok(parsedRequest.data);
    }
    return Result.err(
      CoreError.of.parseRequestError({ message: parsedRequest.error.message }),
    );
  }
}

export class SchemaParser {
  ofSchema<T>(schema: ZodType<T>) {
    return new SchemaParserReadyForParse<T>(schema);
  }
}
