import type { CangkulanCore } from "@/core/cangkulan-core.ts";
import { HttpMethods } from "@/server/http/http-method.ts";
import type { HttpServer } from "@/server/http/http-server.ts";
import { CreateGameController } from "@/server/controllers/games/create-game.controller.ts";

export class CangkulanControllers {
  constructor(
    private core: CangkulanCore,
  ) {}

  mapControllersToServer(server: HttpServer) {
    server.route("/games", (gamesRouter) => {
      gamesRouter.route("/", HttpMethods.POST, new CreateGameController(this.core.createGame));
    });
  }
}
