import { GameWriteRepository } from "@/core/games/contracts/game-write-repository.ts";
import { CardsPerPlayer } from "@/core/games/models/cards-per-player.ts";
import { NumberOfPlayers } from "@/core/games/models/number-of-players.ts";
import { Game } from "@/core/games/models/game/index.ts";
import { Result } from "@/core/common/result.ts";

import { CreateGameRequest, parse } from "./create-game.request.ts";
import { CreateGameResponse } from "./create-game.response.ts";
import type { CoreError } from "@/core/common/core-error.ts";

export class CreateGame {
  constructor(
    private writeRepository: GameWriteRepository,
  ) {}

  parseRequest(request: unknown): Result<CreateGameRequest, CoreError> {
    return parse(request);
  }

  async execute(request: CreateGameRequest): Promise<CreateGameResponse> {
    const cardsPerPlayer = CardsPerPlayer.create(request.cardsPerPlayer);
    const numberOfPlayers = NumberOfPlayers.create(request.numberOfPlayers);

    const game = await Result
      .liftBind(Game.initialize, cardsPerPlayer, numberOfPlayers)
      .toPromise();

    const gameId = await this.writeRepository.saveGame(game);

    return {
      gameId,
      nextActions: game.possibleNextActions,
    };
  }
}
