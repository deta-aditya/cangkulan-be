import express from 'express'
import dotenv from 'dotenv'
import createGameHandler from './handlers/createGame'
import getGameHandler from './handlers/getGame'
import * as Database from './database'

dotenv.config()

const database = Database.create({
  hostname: process.env.DB_HOSTNAME || 'localhost',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME || 'cangkulan',
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
})

const app = express()
const port = process.env.PORT

app.use(express.json())

app.get('/', (req, res) => res.send('Hello, world! This is Cangkulan server'))
app.post('/games', createGameHandler(database))
app.get('/games/:id', getGameHandler(database))

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`)
})
