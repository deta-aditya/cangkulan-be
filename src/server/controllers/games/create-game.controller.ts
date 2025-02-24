import z from "npm:zod";
import { CreateGame } from "@/core/games/workflows/create-game/create-game.ts";
import type { HttpResponse } from "@/framework/http/contracts/http-response.ts";
import { HttpStatuses, type HttpController, type HttpRequest } from "@/framework/http.ts";
import type { BaseController } from "@/server/common/base-controller.ts";
import type { CreateGameResponse } from "@/core/games/workflows/create-game/create-game.response.ts";

export class CreateGameController implements HttpController {
  constructor(
    private baseController: BaseController,
    private createGame: CreateGame,
  ) {}

  private RequestBodySchema = z.object({
    cardsPerPlayer: z.number(),
    numberOfPlayers: z.number(),
    playerName: z.string(),
  });

  parseRequest(request: HttpRequest) {
    return this.baseController
      .parseSchema(this.RequestBodySchema)
      .parse(request.body())
      .toFuture();
  }

  handle(request: HttpRequest): Promise<HttpResponse> {
    return this.parseRequest(request)
      .bind(this.createGame.execute)
      .map(createHttpResponse)
      .mergeErr(this.baseController.handleError)
      .toPromise();
  }
}

const createHttpResponse = (domainResponse: CreateGameResponse): HttpResponse => ({ 
  status: HttpStatuses.Ok, 
  body: domainResponse, 
})
