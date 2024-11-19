import { Result } from "@/core/common/result";
import { CardsPerPlayer } from "../cards-per-player";
import { GameError, GameErrors } from "../game-error";
import { NumberOfPlayers } from "../number-of-players";
import { GameState, GameStates } from "./game.state";
import { GameAction } from "./game.action";

export class Game {
  constructor(
    public readonly state: GameState
  ) {}

  static TOTAL_CARDS = 52;

  static initialize(
    cardsPerPlayer: CardsPerPlayer, 
    numberOfPlayers: NumberOfPlayers,
  ): Result<Game, GameError> { 
    return Result.validate(
      cardsPerPlayer.value * numberOfPlayers.value <= Game.TOTAL_CARDS,
      () => new Game(
        GameStates.waitingForPlayers({
          cardsPerPlayer,
          numberOfPlayers,
          players: [],
        }),
      ),
      () => GameErrors.invalidPlayersAndCardsCombination({
        cardsPerPlayer: cardsPerPlayer.value,
        numberOfPlayers: numberOfPlayers.value,
      }),
    );
  }

  get possibleNextActions(): GameAction['kind'][] {
    return GameStates.match(this.state, {
      waitingForPlayers: () => [
        'addPlayer',
      ],
    })
  }
}