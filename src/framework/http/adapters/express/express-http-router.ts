import { type IRouter } from "npm:@types/express@4.17.17";
import { isHttpMethod, type HttpController, type HttpMethod, type HttpRouter } from "@/framework/http.ts";
import { ExpressHttpControllerAdapter } from "./express-http-controller-adapter.ts";
import { ExpressHttpRouteFunctionAdapter } from "./express-http-route-function-adapter.ts";
import type { ExpressHttpRouteAdapter } from "./express-http-route-adapter.ts";

export class ExpressHttpRouter implements HttpRouter {
  constructor(private expressRouter: IRouter) {}

  route(
    path: string,
    routeRegistration: (route: HttpRouter) => void,
  ): HttpRouter;
  route(
    path: string,
    method: HttpMethod,
    controller: HttpController,
  ): HttpRouter;
  route(
    path: string,
    methodOrRouteRegistration: HttpMethod | ((route: HttpRouter) => void),
    controller?: HttpController,
  ): HttpRouter {
    let adapter: ExpressHttpRouteAdapter;

    if (isHttpMethod(methodOrRouteRegistration) && controller) {
      adapter = new ExpressHttpControllerAdapter(
        path,
        methodOrRouteRegistration,
        controller,
      );
    }

    if (typeof methodOrRouteRegistration === "function") {
      adapter = new ExpressHttpRouteFunctionAdapter(
        path,
        methodOrRouteRegistration,
      );
    }

    adapter!.adapt(this.expressRouter);

    return this;
  }
}
