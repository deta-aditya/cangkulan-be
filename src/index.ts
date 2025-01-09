import { MongodbDatabase } from "./framework/database/mongodb-database.ts";
import { DbCangkulanRepositories } from "@/database/repositories/db-cangkulan-repositories.ts";
import { ExpressHttpServer } from "./framework/http/adapters/express/express-http-server.ts";
import { CangkulanServer } from "./server/cangkulan-server.ts";
import { CangkulanCore } from "@/core/cangkulan-core.ts";
import type { Env } from "@/env.ts";

export const main = async (env: Env) => {
  const database = new MongodbDatabase(env.mongoUri);

  await database.connect();

  const databaseRepositories = new DbCangkulanRepositories(database);

  const core = new CangkulanCore(databaseRepositories);

  const cangkulanServer = new CangkulanServer(core);
  const httpServer = new ExpressHttpServer(env.port);

  cangkulanServer.registerControllers(httpServer);

  httpServer.run();
};
