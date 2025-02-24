import { Future } from "@/core/common/future.ts";
import { CoreError } from "@/core/common/core-error.ts";
import type { Option } from "@/core/common/option.ts";
import type { Game } from "@/core/games/models/game.ts";
import type { GameError } from "@/core/games/models/game-error.ts";
import { GameErrors } from "@/core/games/models/game-error.ts";
import type { GameWriteRepository } from "@/core/games/contracts/game-write-repository.ts";
import type { GameReadRepository } from "@/core/games/contracts/game-read-repository.ts";

import type { AddPlayerResponse } from "./add-player.response.ts";
import type { AddPlayerRequest } from "./add-player.request.ts";

export class AddPlayer {
  private workflow: ReturnType<typeof addPlayerWorkflow>;

  constructor(
    readRepository: GameReadRepository,
    writeRepository: GameWriteRepository,
  ) {
    this.workflow = addPlayerWorkflow(readRepository, writeRepository);
  }

  execute(request: AddPlayerRequest): Future<AddPlayerResponse, CoreError> {
    return this.workflow(request);
  }
}

const addPlayerWorkflow = 
  (readRepository: GameReadRepository, writeRepository: GameWriteRepository) =>
  (request: AddPlayerRequest) =>
    readRepository
      .findGameById(request.gameId)
      .bind(handleNotFoundGame(request.gameId))
      .map(addPlayer(request.playerName))
      .bind(saveGame(writeRepository))
      .map(createResponse);

const handleNotFoundGame = (gameId: string) => (game: Option<Game>) =>
  game
    .toResult(makeGameError(gameId))
    .mapErr(makeCoreError)
    .toFuture();

const makeGameError = (gameId: string) => () =>
  GameErrors.gameNotFound({ gameId: gameId });

const makeCoreError = (reason: GameError) =>
  CoreError.of.gameDomainError({ reason });

const addPlayer = (playerName: string) => (game: Game) => 
  game.addPlayer({ name: playerName });

const saveGame = (writeRepository: GameWriteRepository) => (game: Game) => 
  writeRepository
    .saveGame(game)
    .map(() => game);

const createResponse = (game: Game) => ({
  nextActions: game.possibleNextActions,
});
