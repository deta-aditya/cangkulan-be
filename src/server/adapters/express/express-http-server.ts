import express from "npm:express";
import { type Express } from "npm:@types/express@4.17.17";
import { type HttpServer } from "@/server/http/http-server.ts";
import { type HttpController } from "@/server/http/http-controller.ts";
import { type HttpMethod } from "@/server/http/http-method.ts";
import { type HttpRouter } from "@/server/http/http-router.ts";
import { ExpressHttpRouter } from "./express-http-router.ts";

export class ExpressHttpServer implements HttpServer {
  private express: Express;
  private port: number;

  constructor(port: number) {
    this.express = express();
    this.port = port;

    this.express.use(express.json());
  }

  route(
    path: string,
    routeRegistration: (route: HttpRouter) => void,
  ): HttpRouter;
  route(
    path: string,
    method: HttpMethod,
    controller: HttpController,
  ): HttpRouter;
  route(path: unknown, method: unknown, controller?: unknown): HttpRouter {
    return new ExpressHttpRouter(this.express).route(
      path as string,
      method as HttpMethod,
      controller as HttpController,
    );
  }

  run(): void {
    this.express.listen(this.port);
  }
}
