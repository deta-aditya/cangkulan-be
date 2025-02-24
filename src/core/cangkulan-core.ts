import { CreateGame } from "@/core/games/workflows/create-game/create-game.ts";
import { AddPlayer } from "@/core/games/workflows/add-player/add-player.ts";
import type { CangkulanRepositories } from "@/core/cangkulan-repositories.ts";

export class CangkulanCore {
  public readonly createGame: CreateGame;
  public readonly addPlayer: AddPlayer;

  constructor(
    repositories: CangkulanRepositories,
  ) {
    this.createGame = new CreateGame(repositories.gameWrite);
    this.addPlayer = new AddPlayer(repositories.gameRead, repositories.gameWrite);
  }
}
