import { CreateGame } from "@/core/games/workflows/create-game/create-game.ts";
import { parse } from "@/core/games/workflows/create-game/create-game.request.ts";
import type { HttpController } from "@/server/http/http-controller.ts";
import type { HttpRequest } from "@/server/http/http-request.ts";
import type { HttpResponse } from "@/server/http/http-response.ts";

export class CreateGameController implements HttpController {
  constructor(
    private createGame: CreateGame,
  ) {}

  handle(request: HttpRequest): Promise<HttpResponse> {
    return parse(request.body())
      .toPromise()
      .then((request) => this.createGame.execute(request))
      .then((result) => ({ status: 200, body: result }))
      .catch((err) => {
        console.error(err);
        return Promise.resolve({ status: 500 });
      });
  }
}
