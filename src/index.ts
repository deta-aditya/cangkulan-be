import { MongodbDatabase } from "@/database/mongodb-database.ts";
import { DbCangkulanRepositories } from "@/database/repositories/db-cangkulan-repositories.ts";
import { ExpressHttpServer } from "@/server/adapters/express/express-http-server.ts";
import { CangkulanControllers } from "@/server/controllers/cangkulan-controllers.ts";
import { CangkulanCore } from "@/core/cangkulan-core.ts";
import type { Env } from "@/env.ts";

export const main = async (env: Env) => {
  const database = new MongodbDatabase(env.mongoUri);

  await database.connect();

  const databaseRepositories = new DbCangkulanRepositories(database);

  const core = new CangkulanCore(databaseRepositories);

  const rootControllers = new CangkulanControllers(core);
  const server = new ExpressHttpServer(env.port);

  rootControllers.mapControllersToServer(server);

  server.run();
};
