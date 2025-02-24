import { GameError } from "@/core/games/models/game-error.ts";
import { having, Infer, unionOf } from "./union.ts";

export const CoreErrorVariants = unionOf({
  parseRequestError: having<{ message: string }>(),
  gameDomainError: having<{ reason: GameError }>(),
  dataGatewayError: having<{ message: string }>(),
});

export type CoreErrorVariant = Infer<typeof CoreErrorVariants>;

export class CoreError extends Error {
  constructor(public variant: CoreErrorVariant) {
    super(CoreErrorVariants.match(variant, {
      dataGatewayError: ({ message }) => message,
      gameDomainError: ({ reason }) => reason.kind,
      parseRequestError: ({ message }) => message,
    }));
  }

  static of = (() => ({
    ...CoreErrorVariants,
    parseRequestError: (values: { message: string }) => {
      return new CoreError(CoreErrorVariants.parseRequestError(values))
    },
    gameDomainError: (values: { reason: GameError }) => {
      return new CoreError(CoreErrorVariants.gameDomainError(values))
    },
    dataGatewayError: (values: { message: string }) => {
      return new CoreError(CoreErrorVariants.dataGatewayError(values))
    },
  }))()
}
