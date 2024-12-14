import { MongodbDatabase } from "@/database/mongodb-database.ts";
import { ExpressHttpServer } from "@/server/adapters/express/express-http-server.ts";
import { HttpMethods } from "@/server/http/http-method.ts";
import { CreateGameController } from "@/server/controllers/games/create-game.controller.ts";
import { CreateGame } from "@/core/games/workflows/create-game/create-game.ts";
import { DbGameWriteRepository } from "@/database/data-gateway/db-game-write-repository.ts";
import type { Env } from "@/env.ts";

export const main = async (env: Env) => {
  const database = new MongodbDatabase(env.mongoUri);

  await database.connect();

  const server = new ExpressHttpServer(env.port);

  const gameWriteRepository = new DbGameWriteRepository(database);

  const createGameController = new CreateGameController(
    new CreateGame(gameWriteRepository),
  );

  server.route("/games", (gamesRouter) => {
    gamesRouter.route("/", HttpMethods.POST, createGameController);
  });

  server.run();
};
