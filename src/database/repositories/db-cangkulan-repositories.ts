import type { CangkulanRepositories } from "@/core/cangkulan-repositories.ts";
import type { MongodbDatabase } from "@/framework/database/mongodb-database.ts";
import { DbGameWriteRepository } from "@/database/repositories/db-game-write-repository.ts";
import { DbGameReadRepository } from "@/database/repositories/db-game-read-repository.ts";
import type { GameWriteRepository } from "@/core/games/contracts/game-write-repository.ts";
import type { GameReadRepository } from "@/core/games/contracts/game-read-repository.ts";

export class DbCangkulanRepositories implements CangkulanRepositories {
  public readonly gameWrite: GameWriteRepository;
  public readonly gameRead: GameReadRepository;

  constructor(database: MongodbDatabase) {
    const gameCollection = database.collection('games');
    this.gameWrite = new DbGameWriteRepository(gameCollection);
    this.gameRead = new DbGameReadRepository(gameCollection);
  }
}
