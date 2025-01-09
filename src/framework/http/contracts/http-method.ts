import type { EnumOf } from "@/core/common/enum.ts";

export const HttpMethods = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
} as const;

export type HttpMethod = EnumOf<typeof HttpMethods>;

export const isHttpMethod = (value: unknown): value is HttpMethod => {
  return Object.values(HttpMethods).map(String).includes(String(value));
};
