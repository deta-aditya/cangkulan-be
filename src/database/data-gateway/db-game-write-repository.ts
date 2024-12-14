import type { Collection } from "npm:mongodb";
import type { Game } from "@/core/games/models/game/game.ts";
import type { GameWriteRepository } from "@/core/games/contracts/game-write-repository.ts";
import type { MongodbDatabase } from "@/database/mongodb-database.ts";

export class DbGameWriteRepository implements GameWriteRepository {
  private collection: Collection;

  constructor(
    database: MongodbDatabase,
  ) {
    this.collection = database.collection("games");
  }

  async saveGame(game: Game): Promise<string> {
    const insertResult = await this.collection.insertOne(game);
    return insertResult.insertedId.toString();
  }
}
