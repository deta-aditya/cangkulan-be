import { HttpStatuses, type HttpResponse } from "@/framework/http.ts";
import { CoreError } from "@/core/common/core-error.ts";
import { GameErrors } from "@/core/games/models/game-error.ts";
import type { GameError } from "@/core/games/models/game-error.ts";

export class ErrorHandler {
  handle(error: unknown): HttpResponse {
    if (error instanceof CoreError) {
      return CoreError.of.match<HttpResponse>(error.variant, {
        gameDomainError: ({ reason }) => this.handleGameError(reason),
        parseRequestError: ({ message }) => ({ 
          status: HttpStatuses.BadRequest, 
          body: { code: error.variant.kind, message }, 
        }),
        dataGatewayError: ({ message }) => ({
          status: HttpStatuses.InternalServerError,
          body: { code: error.variant.kind, message },
        })
      });
    }

    if (error instanceof Error) {
      return { 
        status: HttpStatuses.InternalServerError, 
        body: {
          code: 'genericError',
          message: error.message 
        }, 
      };
    }

    return {
      status: HttpStatuses.InternalServerError,
      body: { 
        code: 'unknownError',
        message: `Error is unknown. Here is the stringified value: ${JSON.stringify(error)}` 
      },
    };
  }

  private handleGameError(error: GameError) {
    return GameErrors.match(error, {
      invalidCardsPerPlayer: ({ actualValue, maximumValue }) => ({
        status: HttpStatuses.BadRequest, 
        body: {
          code: error.kind,
          message: `Invalid cards per player. It should be a positive integer not be more than ${maximumValue} (Given value: ${actualValue}).`,
        }
      }),
      invalidNumberOfPlayers: ({ actualValue, maximumValue }) => ({
        status: HttpStatuses.BadRequest, 
        body: {
          code: error.kind,
          message: `Invalid number of players. It should be a positive integer not be more than ${maximumValue} (Given value: ${actualValue}).`,
        }
      }),
      invalidPlayersAndCardsCombination: ({ cardsPerPlayer, numberOfPlayers }) => ({
        status: HttpStatuses.BadRequest, 
        body: {
          code: error.kind,
          message: `Invalid number of players and cards combination. Reduce one of them, so each players can start with enough cards (Given value, cards: ${cardsPerPlayer}, players: ${numberOfPlayers}).`,
        }
      }),
      gameNotFound: ({ gameId }) => ({
        status: HttpStatuses.BadRequest,
        body: {
          code: error.kind,
          message: `Game with ID of ${gameId} does not exist!` 
        }
      })
    })
  }
}
