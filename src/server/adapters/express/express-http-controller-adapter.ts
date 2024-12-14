import type { IRouter } from "npm:@types/express@4.17.17";
import type { HttpMethod } from "@/server/http/http-method.ts";
import type { HttpController } from "@/server/http/http-controller.ts";
import type { ExpressHttpRouteAdapter } from "@/server/adapters/express/express-http-route-adapter.ts";
import { ExpressHttpRequest } from "@/server/adapters/express/express-http-request.ts";

export class ExpressHttpControllerAdapter implements ExpressHttpRouteAdapter {
  constructor(
    private path: string,
    private method: HttpMethod,
    private controller: HttpController,
  ) {}

  private readonly METHOD_MAPPER = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "delete",
  } as const;

  adapt(expressRouter: IRouter) {
    const method = this.METHOD_MAPPER[this.method];

    expressRouter[method](
      this.path,
      async (expressRequest, expressResponse) => {
        const request = new ExpressHttpRequest(expressRequest);
        const response = await this.controller.handle(request);

        expressResponse.status(response.status).json(response.body);
      },
    );
  }
}
