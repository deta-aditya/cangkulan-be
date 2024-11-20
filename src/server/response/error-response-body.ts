import { CoreErrors } from "@/core/common/core-error";
import { GameError, GameErrors } from "@/core/games/models/game-error";
import { ERROR_CODE, ErrorCode } from "./error-code"

export type ErrorResponseBody = {
  code: ErrorCode;
  message: string;
  loggedMessage?: string;
};

export const parseFromError = (error: unknown) => {
  if (CoreErrors.isValid(error)) {
    return CoreErrors.match<ErrorResponseBody>(error, {
      gameDomainError: ({ reason }) => createFromGameDomainError(reason),
      parseRequestError: ({ message }) => ({
        code: ERROR_CODE.parseRequestError,
        message,
      }),
    });
  }

  if (error instanceof Error) {
    return {
      code: ERROR_CODE.unknownError,
      message: 'An internal error has occurred. Please try agian later.',
      loggedMessage: `The thrown error is not part error CoreError. Here is the message: ${error.message}`,
    };
  }

  return {
    code: ERROR_CODE.unknownError,
    message: 'An internal error has occurred. Please try agian later.',
    loggedMessage: `The thrown error has an unknown type. Here is the stringified result: ${String(error)}`,
  };
}

export const createFromGameDomainError = (gameError: GameError) => {
  return GameErrors.match<ErrorResponseBody>(gameError, {
    invalidCardsPerPlayer: ({ actualValue, maximumValue }) => ({
      code: ERROR_CODE.invalidCardsPerPlayer,
      message: `${actualValue} cards per player is above the maximum value of ${maximumValue}. Please reduce it.`,
    }),
    invalidNumberOfPlayers: ({ actualValue, maximumValue }) => ({
      code: ERROR_CODE.invalidNumberOfPlayers,
      message: `${actualValue} number of players is above the maximum value of ${maximumValue}. Please reduce it.`,
    }),
    invalidPlayersAndCardsCombination: ({ cardsPerPlayer, numberOfPlayers }) => ({
      code: ERROR_CODE.invalidPlayersAndCardsCombination,
      message: `A combination of ${cardsPerPlayer} cards and ${numberOfPlayers} players exceed the total of playable cards. Please reduce one of them.`,
    }),
  });
}
