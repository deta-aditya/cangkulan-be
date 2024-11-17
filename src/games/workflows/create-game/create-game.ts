import { GameWriteDataGateway } from "@/games/contracts/game-write-data-gateway";
import { CardsPerPlayer } from "@/games/models/cards-per-player";
import { NumberOfPlayers } from "@/games/models/number-of-players";
import { Game } from "@/games/models/game/game";
import { Result } from "@/common/result";

import { CreateGameRequest } from "./create-game.request";
import { CreateGameResponse } from "./create-game.response";

export class CreateGame {
  constructor(
    private writeDataGateway: GameWriteDataGateway
  ) {}

  async execute(request: CreateGameRequest): Promise<CreateGameResponse> {
    const cardsPerPlayer = CardsPerPlayer.create(request.cardsPerPlayer)
    const numberOfPlayers = NumberOfPlayers.create(request.numberOfPlayers)

    const game = await Result
      .liftBind(Game.initialize, cardsPerPlayer, numberOfPlayers)
      .toPromise();

    const gameId = await this.writeDataGateway.saveGame(game);

    return { 
      gameId,
      nextActions: game.possibleNextActions,
    }
  }
}
