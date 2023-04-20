import express from 'express'
import dotenv from 'dotenv'
import createGameHandler from './handlers/createGame'
import getGameHandler from './handlers/getGame'

import checkInHandler from './webSocketHandlers/checkIn'
import * as Database from './database'
import * as WebSocket from './websocket'

dotenv.config()

const database = Database.create({
  hostname: process.env.DB_HOSTNAME || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME || 'cangkulan',
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
})

const webSocket = WebSocket.create({
  port: process.env.WS_PORT ? Number(process.env.WS_PORT) : 8080,
})

webSocket.on('/games/check-in', checkInHandler)
webSocket.listen()

const httpServer = express()
const port = process.env.PORT || 8000

httpServer.use(express.json())

httpServer.get('/', (req, res) => res.send('Hello, world! This is Cangkulan server'))
httpServer.post('/games', createGameHandler(database))
httpServer.get('/games/:id', getGameHandler(database))

httpServer.listen(port, () => {
  console.log(`[server]: HTTP server is running at http://localhost:${port}`)
})
