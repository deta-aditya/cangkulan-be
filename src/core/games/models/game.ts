import { Result } from "@/core/common/result.ts";
import { CardsPerPlayer } from "@/core/games/models/cards-per-player.ts";
import { GameError, GameErrors } from "@/core/games/models/game-error.ts";
import { NumberOfPlayers } from "@/core/games/models/number-of-players.ts";
import { GameState, GameStates } from "@/core/games/models/game-state.ts";
import type { GameId } from "@/core/games/models/game-id.ts";
import { Option } from "@/core/common/option.ts";
import type { Player } from "@/core/games/models/player.ts";

export class Game {
  constructor(
    public readonly gameId: Option<GameId>,
    public readonly state: GameState,
  ) {}

  static TOTAL_CARDS = 52;

  static initialize(
    cardsPerPlayer: CardsPerPlayer,
    numberOfPlayers: NumberOfPlayers,
  ): Result<Game, GameError> {
    return Option
      .some({ cardsPerPlayer, numberOfPlayers })
      .filter(isGameParameterValid)
      .map(createInitialGame)
      .toResult(createGameError(cardsPerPlayer, numberOfPlayers));
  }

  addPlayer(player: Player) {
    return new Game(this.gameId, GameStates.match(this.state, {
      waitingForPlayers: (currentState) => GameStates.waitingForPlayers({
        ...currentState,
        players: [...currentState.players, player],
      }),
      readyToPlay: () => this.state,
    }));
  }
  
  withId(id: GameId) {
    return new Game(Option.some(id), this.state);
  }

  get possibleNextActions(): string[] {
    return GameStates.match(this.state, {
      waitingForPlayers: () => [
        "addPlayer",
      ],
      readyToPlay: () => [],
    });
  }
}

type GameParameter = {
  cardsPerPlayer: CardsPerPlayer, 
  numberOfPlayers: NumberOfPlayers,
};

const isGameParameterValid = ({ cardsPerPlayer, numberOfPlayers }: GameParameter) => 
  cardsPerPlayer.value * numberOfPlayers.value <= Game.TOTAL_CARDS;

const createInitialGame = ({ cardsPerPlayer, numberOfPlayers }: GameParameter) =>
  new Game(
    Option.none(),
    GameStates.waitingForPlayers({ cardsPerPlayer, numberOfPlayers, players: [] })
  );

const createGameError = (cardsPerPlayer: CardsPerPlayer, numberOfPlayers: NumberOfPlayers) => 
  () => GameErrors.invalidPlayersAndCardsCombination({
    cardsPerPlayer: cardsPerPlayer.value,
    numberOfPlayers: numberOfPlayers.value,
  });
  