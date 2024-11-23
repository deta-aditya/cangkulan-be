import { Router } from "express"
import { CreateGameController } from "./create-game.controller";
import { MongodbDatabase } from "@/database/mongodb-database";
import { CreateGame } from "@/core/games/workflows/create-game";
import { DbGameWriteRepository } from "@/database/data-gateway/db-game-write-repository";

export const createGamesRouter = (
  database: MongodbDatabase,
) => {
  const writeRepository = new DbGameWriteRepository(database);

  const createGameController = new CreateGameController(
    new CreateGame(writeRepository)
  );

  const router = Router();
  
  router.post('/', createGameController.handle);

  return router;
}
