import express from 'express'
import dotenv from 'dotenv'
import createGameHandler from './httpHandlers/createGame'
import getGameHandler from './httpHandlers/getGame'

import playerJoin from './webSocketHandlers/playerJoin'
import * as Database from './database'
import * as WebSocket from './websocket'
import * as Cache from './cache'
import * as Receptionist from './receptionist'
import * as FindGameById from './games/findGameById'
import playerLeave from './webSocketHandlers/playerLeave'

dotenv.config()

const database = Database.create({
  hostname: process.env.DB_HOSTNAME || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME || 'cangkulan',
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
})

const cache = Cache.create()

const webSocket = WebSocket.create({
  port: process.env.WS_PORT ? Number(process.env.WS_PORT) : 8080,
})

const receptionist = Receptionist.create(webSocket)
const findGameById = FindGameById.resolve(database, cache)

webSocket.on('player-join', playerJoin(cache, receptionist, findGameById))
webSocket.on('player-leave', playerLeave(cache, receptionist, findGameById))
webSocket.listen()

const httpServer = express()
const port = process.env.PORT || 8000

httpServer.use(express.json())

httpServer.get('/', (req, res) => res.send('Hello, world! This is Cangkulan server'))
httpServer.post('/games', createGameHandler(cache, database))
httpServer.get('/games/:id', getGameHandler(findGameById))

httpServer.listen(port, () => {
  console.log(`[server]: HTTP server is running at http://localhost:${port}`)
})
