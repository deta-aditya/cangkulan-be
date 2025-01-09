import z from "npm:zod";
import { CreateGame } from "@/core/games/workflows/create-game/create-game.ts";
import type { HttpResponse } from "@/framework/http/contracts/http-response.ts";
import { HttpStatuses, type HttpController, type HttpRequest } from "@/framework/http.ts";
import type { BaseController } from "@/server/common/base-controller.ts";

export class CreateGameController implements HttpController {
  constructor(
    private baseController: BaseController,
    private createGame: CreateGame,
  ) {}

  private RequestBodySchema = z.object({
    cardsPerPlayer: z.number(),
    numberOfPlayers: z.number(),
  });

  parseRequest(request: HttpRequest) {
    return this.baseController
      .parseSchema(this.RequestBodySchema)
      .parse(request.body())
      .toPromise();
  }

  handle(request: HttpRequest): Promise<HttpResponse> {
    return this.baseController.handleError(async () => {
      const parsedRequest = await this.parseRequest(request);
      const response = await this.createGame.execute(parsedRequest);
      return { status: HttpStatuses.Ok, body: response };
    })
  }
}
