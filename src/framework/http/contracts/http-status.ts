import type { EnumOf } from "@/core/common/enum.ts";

export const HttpStatuses = {
  Ok: 200,
  BadRequest: 400,
  InternalServerError: 500,
};

export type HttpStatus = EnumOf<typeof HttpStatuses>;
