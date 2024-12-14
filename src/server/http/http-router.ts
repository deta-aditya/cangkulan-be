import type { HttpMethod } from "@/server/http/http-method.ts";
import type { HttpController } from "@/server/http/http-controller.ts";

export interface HttpRouter {
  route(
    path: string,
    routeRegistration: (route: HttpRouter) => void,
  ): HttpRouter;
  route(
    path: string,
    method: HttpMethod,
    controller: HttpController,
  ): HttpRouter;
}
