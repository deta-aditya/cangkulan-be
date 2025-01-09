import express from "npm:express";
import type { IRouter } from "npm:@types/express@4.17.17";
import type { HttpRouter } from "@/framework/http.ts";
import { ExpressHttpRouter } from "./express-http-router.ts";
import type { ExpressHttpRouteAdapter } from "./express-http-route-adapter.ts";

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
