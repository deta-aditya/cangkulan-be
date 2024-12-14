import express from "npm:express";
import type { IRouter } from "npm:@types/express@4.17.17";
import type { ExpressHttpRouteAdapter } from "@/server/adapters/express/express-http-route-adapter.ts";
import { ExpressHttpRouter } from "@/server/adapters/express/express-http-router.ts";
import type { HttpRouter } from "@/server/http/http-router.ts";

export class ExpressHttpRouteFunctionAdapter
  implements ExpressHttpRouteAdapter {
  constructor(
    private path: string,
    private routeRegistration: (route: HttpRouter) => void,
  ) {}

  adapt(expressRouter: IRouter) {
    const currentRouter = express.Router();
    this.routeRegistration(new ExpressHttpRouter(currentRouter));
    expressRouter.use(this.path, currentRouter);
  }
}
