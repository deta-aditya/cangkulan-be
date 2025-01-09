import type { HttpRequest } from "./http-request.ts";
import type { HttpResponse } from "./http-response.ts";

export interface HttpController {
  handle(request: HttpRequest): Promise<HttpResponse>;
}
