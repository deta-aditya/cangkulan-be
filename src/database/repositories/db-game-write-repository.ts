import type { Collection } from "npm:mongodb";
import type { Game } from "@/core/games/models/game/game.ts";
import type { GameWriteRepository } from "@/core/games/contracts/game-write-repository.ts";

export class DbGameWriteRepository implements GameWriteRepository {
  constructor(private gameCollection: Collection) {}

  async saveGame(game: Game): Promise<string> {
    const insertResult = await this.gameCollection.insertOne(game);
    return insertResult.insertedId.toString();
  }
}
