import express from 'express'
import dotenv from 'dotenv'

import { MongodbDatabase } from './database/mongodb-database'
import { registerRouters } from './server/router'

dotenv.config()

const database = new MongodbDatabase(process.env.MONGO_URI || '');

const httpServer = express()
const port = process.env.PORT || 8000

httpServer.use(express.json())

registerRouters(httpServer, database);

httpServer.listen(port, () => {
  console.log(`[Server]: HTTP server is running at http://localhost:${port}`)
})
