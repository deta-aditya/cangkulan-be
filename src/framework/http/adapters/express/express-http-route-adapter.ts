import type { IRouter } from "npm:@types/express@4.17.17";

export interface ExpressHttpRouteAdapter {
  adapt(expressRouter: IRouter): void;
}
