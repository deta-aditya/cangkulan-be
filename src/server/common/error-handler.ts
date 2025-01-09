import { HttpStatuses, type HttpResponse } from "@/framework/http.ts";
import { CoreErrors } from "@/core/common/core-error.ts";
import { GameErrors } from "@/core/games/models/game-error.ts";
import type { GameError } from "@/core/games/models/game-error.ts";

export class ErrorHandler {
  handle(error: unknown): HttpResponse {
    if (CoreErrors.isValid(error)) {
      return CoreErrors.match(error, {
        gameDomainError: ({ reason }) => this.handleGameError(reason),
        parseRequestError: ({ message }) => ({ 
          status: HttpStatuses.BadRequest, body: { message } 
        }),
      });
    }

    if (error instanceof Error) {
      return { 
        status: HttpStatuses.InternalServerError, 
        body: { message: error.message }, 
      };
    }

    return {
      status: HttpStatuses.InternalServerError,
      body: { message: `Error is unknown. Here is the stringified value: ${String(error)}` },
    };
  }

  private handleGameError(error: GameError) {
    return GameErrors.match(error, {
      invalidCardsPerPlayer: ({ actualValue, maximumValue }) => ({
        status: HttpStatuses.BadRequest, body: { message: `Invalid cards per player. It should not be more than ${maximumValue} (Given value: ${actualValue}).` }
      }),
      invalidNumberOfPlayers: ({ actualValue, maximumValue }) => ({
        status: HttpStatuses.BadRequest, body: { message: `Invalid number of players. It should not be more than ${maximumValue} (Given value: ${actualValue}).` }
      }),
      invalidPlayersAndCardsCombination: ({ cardsPerPlayer, numberOfPlayers }) => ({
        status: HttpStatuses.BadRequest, body: { message: `Invalid number of players and cards combination. Reduce one of them, so each players can start with enough cards (Given value, cards: ${cardsPerPlayer}, players: ${numberOfPlayers}).` }
      })
    })
  }
}
