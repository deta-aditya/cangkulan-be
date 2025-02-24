import type { Collection } from "npm:mongodb";
import type { WithId } from "npm:mongodb";
import { ObjectId } from "npm:mongodb";
import type { GameReadRepository } from "@/core/games/contracts/game-read-repository.ts";
import { CoreError } from "@/core/common/core-error.ts";
import { Future } from "@/core/common/future.ts";
import { Option } from "@/core/common/option.ts";
import type { GameId } from "@/core/games/models/game-id.ts";
import type { Game } from "@/core/games/models/game.ts";
import type { Result } from "@/core/common/result.ts";

type GameSchema = {
  state: {
    kind: string;
    players: Array<{
      name: string;
    }>;
    numberOfPlayers: number;
    cardsPerPlayer: number;
  };
};

export class DbGameReadRepository implements GameReadRepository {
  constructor(private gameCollection: Collection<GameSchema>) {}

  findGameById(id: GameId): Future<Option<Game>, CoreError> {
    return find(this.gameCollection, id)
      .mapErr(makeDataGatewayError)
      .bind(deserializeWhenAvailable);
  }
}

const find = (gameCollection: Collection<GameSchema>, id: GameId): Future<Option<WithId<GameSchema>>, unknown> => 
  Future
    .ofResolve(id)
    .bindAsync(id => gameCollection.findOne({ _id: ObjectId(id) }))
    .map(Option.fromNullable);

const deserializeWhenAvailable = (game: Option<WithId<GameSchema>>): Future<Option<Game>, CoreError> => 
  game
    .map(deserializeGame)
    .map(s => s.toFuture())
    .transposeFuture();

const deserializeGame = (game: WithId<GameSchema>): Result<Game, CoreError> => {
  
}

const makeDataGatewayError = (error: unknown) =>
  CoreError.of.dataGatewayError({ 
    message: error instanceof Error ? error.message : String(error)
  });
