import type { CangkulanCore } from "@/core/cangkulan-core.ts";
import { HttpMethods, type HttpServer } from "@/framework/http.ts";
import { CreateGameController } from "./controllers/games/create-game.controller.ts";
import { SchemaParser } from "@/server/common/schema-parser.ts";
import { ErrorHandler } from "@/server/common/error-handler.ts";
import { BaseController } from "@/server/common/base-controller.ts";

export class CangkulanServer {
  private baseController: BaseController;

  constructor(
    private core: CangkulanCore,
  ) {
    this.baseController = new BaseController(
      new SchemaParser(),
      new ErrorHandler(),
    );
  }

  registerControllers(server: HttpServer) {
    server.route("/games", (gamesRouter) => {
      gamesRouter.route("/", HttpMethods.POST, new CreateGameController(
        this.baseController,
        this.core.createGame,
      ));
    });
  }
}
