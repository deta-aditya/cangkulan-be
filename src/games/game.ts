import { DbRowGame } from "./schemas"

export interface Game {
  addPlayer(playerId: number): void
  removePlayer(playerId: number): void
  readonly canStartGame: boolean
  readonly forDbRow: DbRowGame
}

export type NewGame = Pick<Game, 'forDbRow'>

interface Config {
  cardsPerPlayer: number
  numberOfPlayers: number
}

export class GameImpl implements Game {
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

  addPlayer(playerId: number): void {
    this.joinedPlayers.add(playerId)
  }

  removePlayer(playerId: number): void {
    this.joinedPlayers.delete(playerId)
  }
}

export class NewGameImpl implements NewGame {
  config: Config

  constructor(config: Config) {
    this.config = config
  }

  get forDbRow() {
    return {
      id: 0,
      config: this.config,
      state: {
        joinedPlayers: [],
      }
    }
  }
}