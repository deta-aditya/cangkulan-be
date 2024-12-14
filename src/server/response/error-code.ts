export const ERROR_CODE = {
  parseRequestError: "PARSE_REQUEST_ERROR",
  invalidCardsPerPlayer: "INVALID_CARDS_PER_PLAYER",
  invalidNumberOfPlayers: "INVALID_NUMBER_OF_PLAYERS",
  invalidPlayersAndCardsCombination: "INVALID_PLAYERS_AND_CARDS_COMBINATION",
  unknownError: "UNKNOWN_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODE)[keyof typeof ERROR_CODE];

export const getStatusCode = (errorCode: ErrorCode) => {
  return {
    [ERROR_CODE.parseRequestError]: 422,
    [ERROR_CODE.invalidCardsPerPlayer]: 422,
    [ERROR_CODE.invalidNumberOfPlayers]: 422,
    [ERROR_CODE.invalidPlayersAndCardsCombination]: 422,
    [ERROR_CODE.unknownError]: 500,
  }[errorCode];
};
