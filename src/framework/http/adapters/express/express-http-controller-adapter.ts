import type { IRouter } from "npm:@types/express@4.17.17";
import { type HttpMethod, type HttpController, HttpStatuses } from "@/framework/http.ts";
import type { ExpressHttpRouteAdapter } from "./express-http-route-adapter.ts";
import { ExpressHttpRequest } from "./express-http-request.ts";

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

        let responseBody = response.body;
        if (response.status === HttpStatuses.InternalServerError) {
          console.error(response.body);
          responseBody = {
            message: 'An internal server error has occured. Please try again later.'
          };
        }

        expressResponse.status(response.status).json(responseBody);
      },
    );
  }
}
