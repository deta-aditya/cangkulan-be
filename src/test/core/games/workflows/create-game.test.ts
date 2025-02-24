import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { CreateGame } from "@/core/games/workflows/create-game/create-game.ts";
import { CardsPerPlayer } from "@/core/games/models/cards-per-player.ts";
import { NumberOfPlayers } from "@/core/games/models/number-of-players.ts";
import type { GameWriteRepository } from "@/core/games/contracts/game-write-repository.ts";
import { CoreError } from "@/core/common/core-error.ts";
import { GameErrors } from "@/core/games/models/game-error.ts";
import type { Game } from "@/core/games/models/game.ts";
import { GameStates } from "@/core/games/models/game-state.ts";
import { Future } from "@/core/common/future.ts";

const MOCK_GAME_WRITE_REPOSITORY: GameWriteRepository = {
  saveGame: () => Future.ofResolve('xyz'),
};

const TEST_CASES = {
  'should create game successfully': {
    kind: 'success',
    gameWriteRepository: {
      ...MOCK_GAME_WRITE_REPOSITORY,
      saveGame: (game: Game) => {
        expect(game.state).toMatchObject(GameStates.waitingForPlayers({
          players: [
            { name: 'John Doe' },
          ],
          cardsPerPlayer: new CardsPerPlayer(7),
          numberOfPlayers: new NumberOfPlayers(5),
        }));
        return MOCK_GAME_WRITE_REPOSITORY.saveGame(game);
      }
    },
    request: {
      playerName: 'John Doe',
      cardsPerPlayer: 7,
      numberOfPlayers: 5,
    },
    response: {
      gameId: 'xyz',
      nextActions: ['addPlayer'],
    },
  },
  'should fail due to invalid cards per player': {
    kind: 'failure',
    gameWriteRepository: MOCK_GAME_WRITE_REPOSITORY,
    request: {
      playerName: 'John Doe',
      cardsPerPlayer: 10,
      numberOfPlayers: 5,
    },
    throws: CoreError.of.gameDomainError({ 
      reason: GameErrors.invalidCardsPerPlayer({ 
        actualValue: 10, 
        maximumValue: CardsPerPlayer.MAXIMUM_VALUE, 
      }),
    }),
  },
  'should fail due to invalid number of players': {
    kind: 'failure',
    gameWriteRepository: MOCK_GAME_WRITE_REPOSITORY,
    request: {
      playerName: 'John Doe',
      cardsPerPlayer: 7,
      numberOfPlayers: 10,
    },
    throws: CoreError.of.gameDomainError({ 
      reason: GameErrors.invalidNumberOfPlayers({ 
        actualValue: 10, 
        maximumValue: NumberOfPlayers.MAXIMUM_VALUE, 
      }),
    }),
  },
  'should fail due to invalid cards and players combination': {
    kind: 'failure',
    gameWriteRepository: MOCK_GAME_WRITE_REPOSITORY,
    request: {
      playerName: 'John Doe',
      cardsPerPlayer: 9,
      numberOfPlayers: 6,
    },
    throws: CoreError.of.gameDomainError({ 
      reason: GameErrors.invalidPlayersAndCardsCombination({ 
        cardsPerPlayer: 9,
        numberOfPlayers: 6,
      }),
    }),
  },
} as const;

describe('CreateGame', () => {
  for (const [should, testConfig] of Object.entries(TEST_CASES)) {
    it(should, () => {
      const createGame = new CreateGame(testConfig.gameWriteRepository);
      const response = createGame.execute(testConfig.request).toPromise();
      
      if (testConfig.kind === 'success') {
        expect(response).resolves.toStrictEqual(testConfig.response);
      }
      
      if (testConfig.kind === 'failure') {
        expect(response).rejects.toThrow(testConfig.throws);
      }
    });
  }
});
