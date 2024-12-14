import { describe, expect, it, vi } from "vitest";
import { Game, GameStates } from "@/core/games/models/game";
import { CardsPerPlayer } from "@/core/games/models/cards-per-player";
import { NumberOfPlayers } from "@/core/games/models/number-of-players";
import { CreateGame } from "./create-game";

describe("CreateGame", () => {
  it("should execute successfully", async () => {
    const saveGame = vi.fn().mockReturnValue("abc");

    const createGame = new CreateGame({
      saveGame,
    });

    const response = await createGame.execute({
      cardsPerPlayer: 7,
      numberOfPlayers: 4,
    });

    expect(response.gameId).toBe("abc");
    expect(response.nextActions).toStrictEqual(["addPlayer"]);
    expect(saveGame).toHaveBeenCalledWith(
      new Game(GameStates.waitingForPlayers({
        players: [],
        cardsPerPlayer: new CardsPerPlayer(7),
        numberOfPlayers: new NumberOfPlayers(4),
      })),
    );
  });
});
