import type { CangkulanRepositories } from "@/core/cangkulan-repositories.ts";
import type { MongodbDatabase } from "@/framework/database/mongodb-database.ts";
import { DbGameWriteRepository } from "@/database/repositories/db-game-write-repository.ts";

export class DbCangkulanRepositories implements CangkulanRepositories {
  constructor(private database: MongodbDatabase) {}

  get gameWrite() {
    return new DbGameWriteRepository(this.database.collection('games'));
  }

  get gameRead() {
    return {};
  }
}
