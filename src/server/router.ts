import { Express } from 'express';
import { MongodbDatabase } from '@/database/mongodb-database';
import { createGamesRouter } from './controllers/games/games-router';

export const registerRouters = (server: Express, database: MongodbDatabase) => {
  server.use('/games', createGamesRouter(database));
}
