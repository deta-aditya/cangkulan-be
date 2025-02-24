import { GameWriteRepository } from "@/core/games/contracts/game-write-repository.ts";
import { CardsPerPlayer } from "@/core/games/models/cards-per-player.ts";
import { NumberOfPlayers } from "@/core/games/models/number-of-players.ts";
import type { GameError } from "@/core/games/models/game-error.ts";
import { CoreError } from "@/core/common/core-error.ts";
import { Game } from "@/core/games/models/game.ts";
import { Result } from "@/core/common/result.ts";
import { Future } from "@/core/common/future.ts";

import { CreateGameRequest } from "./create-game.request.ts";
import { CreateGameResponse } from "./create-game.response.ts";

export class CreateGame {
  private workflow: ReturnType<typeof createGameWorkflow>;

  constructor(writeRepository: GameWriteRepository) {
    this.workflow = createGameWorkflow(writeRepository);
  }

  execute(request: CreateGameRequest): Future<CreateGameResponse, CoreError> {
    return this.workflow(request);
  }
}

const createGameWorkflow = 
  (writeRepository: GameWriteRepository) => 
  (request: CreateGameRequest): Future<CreateGameResponse, CoreError> => 
    createGame(request)
      .bind(saveGame(writeRepository))
      .map(createResponse);

const createGame = (request: CreateGameRequest) => 
  Result
    .liftBind(
      Game.initialize, 
      CardsPerPlayer.create(request.cardsPerPlayer),
      NumberOfPlayers.create(request.numberOfPlayers),
    )
    .mapErr(makeGameDomainError)
    .map(addPlayer(request.playerName))
    .toFuture();

const makeGameDomainError = (reason: GameError) => 
  CoreError.of.gameDomainError({ reason });

const addPlayer = (playerName: string) => (game: Game) => 
  game.addPlayer({ name: playerName });

const saveGame = (writeRepository: GameWriteRepository) => (game: Game) => 
  writeRepository
    .saveGame(game)
    .map(id => game.withId(id));

const createResponse = (game: Game) => ({ 
  gameId: game.gameId.unwrap(), 
  nextActions: game.possibleNextActions,
});
