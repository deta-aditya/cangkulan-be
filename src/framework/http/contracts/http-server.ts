import type { HttpRouter } from "./http-router.ts";

export interface HttpServer extends HttpRouter {
  run(): void;
}
