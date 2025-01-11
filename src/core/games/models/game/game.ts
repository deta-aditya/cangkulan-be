import { Result } from "@/core/common/result.ts";
import { CardsPerPlayer } from "@/core/games/models/cards-per-player.ts";
import { GameError, GameErrors } from "@/core/games/models/game-error.ts";
import { NumberOfPlayers } from "@/core/games/models/number-of-players.ts";
import { GameState, GameStates } from "@/core/games/models/game/game.state.ts";
import { GameAction } from "@/core/games/models/game/game.action.ts";

export class Game {
  constructor(
    public readonly state: GameState,
  ) {}

  static TOTAL_CARDS = 52;

  static initialize(
    cardsPerPlayer: CardsPerPlayer,
    numberOfPlayers: NumberOfPlayers,
  ): Result<Game, GameError> {
    const isCombinationValid = cardsPerPlayer.value * numberOfPlayers.value <= Game.TOTAL_CARDS;
    const gameState = GameStates.waitingForPlayers({
      cardsPerPlayer,
      numberOfPlayers,
      players: [],
    });

    return Result.validate(gameState, isCombinationValid)
      .map((gameState) => new Game(gameState))
      .mapErr(() => GameErrors.invalidPlayersAndCardsCombination({
        cardsPerPlayer: cardsPerPlayer.value,
        numberOfPlayers: numberOfPlayers.value,
      }));
  }

  get possibleNextActions(): GameAction["kind"][] {
    return GameStates.match(this.state, {
      waitingForPlayers: () => [
        "addPlayer",
      ],
    });
  }
}
