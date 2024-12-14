import type { Json } from "@/core/common/json.ts";
import type { HttpStatus } from "./http-status.ts";

export interface HttpResponse {
  body?: Json;
  status: HttpStatus;
}
