import { GameWriteRepository } from "@/games/contracts/game-write-repository";
import { CardsPerPlayer } from "@/games/models/cards-per-player";
import { NumberOfPlayers } from "@/games/models/number-of-players";
import { Game } from "@/games/models/game";
import { Result } from "@/common/result";

import { CreateGameRequest } from "./create-game.request";
import { CreateGameResponse } from "./create-game.response";

export class CreateGame {
  constructor(
    private writeRepository: GameWriteRepository
  ) {}

  async execute(request: CreateGameRequest): Promise<CreateGameResponse> {
    const cardsPerPlayer = CardsPerPlayer.create(request.cardsPerPlayer)
    const numberOfPlayers = NumberOfPlayers.create(request.numberOfPlayers)

    const game = await Result
      .liftBind(Game.initialize, cardsPerPlayer, numberOfPlayers)
      .toPromise();

    const gameId = await this.writeRepository.saveGame(game);

    return { 
      gameId,
      nextActions: game.possibleNextActions,
    }
  }
}
