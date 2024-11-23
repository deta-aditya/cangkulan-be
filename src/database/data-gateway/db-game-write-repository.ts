import { GameWriteRepository } from "@/core/games/contracts/game-write-repository";
import { Game } from "@/core/games/models/game";
import { MongodbDatabase } from "../mongodb-database";
import { Collection } from "mongodb";

export class DbGameWriteRepository implements GameWriteRepository {
  private collection: Collection;

  constructor(
    database: MongodbDatabase,
  ) {
    this.collection = database.collection('games');
  }

  async saveGame(game: Game): Promise<string> { 
    const insertResult = await this.collection.insertOne(game);
    return insertResult.insertedId.toString();
  }
}
