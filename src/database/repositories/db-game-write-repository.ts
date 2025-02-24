import type { Collection } from "npm:mongodb";
import type { Game } from "@/core/games/models/game.ts";
import type { GameWriteRepository } from "@/core/games/contracts/game-write-repository.ts";
import { CoreError } from "@/core/common/core-error.ts";
import { Future } from "@/core/common/future.ts";
import type { GameId } from "@/core/games/models/game-id.ts";

export class DbGameWriteRepository implements GameWriteRepository {
  constructor(private gameCollection: Collection) {}

  saveGame(game: Game): Future<GameId, CoreError> {
    return Future
      .ofResolve(game)
      .bindAsync(this.gameCollection.insertOne)
      .map(res => String(res.insertedId.id))
      .mapErr(makeDataGatewayError);
  }
}

const makeDataGatewayError = (error: unknown) =>
  CoreError.of.dataGatewayError({ 
    message: error instanceof Error ? error.message : String(error)
  });
