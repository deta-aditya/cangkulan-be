import { Failure, Result, Success } from "../result";
import { Game, GameImpl, NewGame, NewGameImpl } from "./game"
import { DbRowGame, GameConfig } from "./schemas"

export type NewGameError =
  | 'DECK_TOO_FEW'

export interface GameFactory {
  fromDbRow(schema: DbRowGame): Game
  fromConfig(config: GameConfig): Result<NewGame, NewGameError>
}

class DefaultGameFactory implements GameFactory {
  fromConfig(config: { cardsPerPlayer: number; numberOfPlayers: number }): Result<NewGame, NewGameError> {
    const MAX_CARDS = 52;
    if (MAX_CARDS - config.cardsPerPlayer * config.numberOfPlayers < config.cardsPerPlayer) {
      return Failure('DECK_TOO_FEW')
    }
    return Success(new NewGameImpl(config))
  }
  fromDbRow(schema: DbRowGame) {
    return new GameImpl(schema.id, schema.config, new Set(schema.state.joinedPlayers))
  }
}

export function create(): GameFactory {
  return new DefaultGameFactory()
}
