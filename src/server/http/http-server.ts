import type { HttpRouter } from "@/server/http/http-router.ts";

export interface HttpServer extends HttpRouter {
  run(): void;
}
