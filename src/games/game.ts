import { DbRowGame } from "./schemas"

interface IGame {
  addPlayer(playerId: number): void
  removePlayer(playerId: number): void
  readonly canStartGame: boolean
  readonly forDbRow: DbRowGame
}

interface Config {
  cardsPerPlayer: number
  numberOfPlayers: number
}

class Game implements IGame {
  id: number
  config: Config
  joinedPlayers: Set<number>

  constructor(id: number, config: Config, joinedPlayers: Set<number>) {
    this.id = id
    this.config = config
    this.joinedPlayers = joinedPlayers
  }

  get canStartGame() {
    return this.config.numberOfPlayers === this.joinedPlayers.size
  }

  get forDbRow() {
    return {
      id: this.id,
      config: this.config,
      state: {
        joinedPlayers: [...this.joinedPlayers]
      }
    }
  }

  static fromDbRow(schema: DbRowGame) {
    return new Game(schema.id, schema.config, new Set(schema.state.joinedPlayers))
  }

  addPlayer(playerId: number): void {
    this.joinedPlayers.add(playerId)
  }

  removePlayer(playerId: number): void {
    this.joinedPlayers.delete(playerId)
  }
}

export default Game
