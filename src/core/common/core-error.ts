import { GameError } from "@/core/games/models/game-error.ts";
import { having, Infer, unionOf } from "./union.ts";

export const CoreErrorVariants = unionOf({
  parseRequestError: having<{ message: string }>(),
  gameDomainError: having<{ reason: GameError }>(),
});

export type CoreErrorVariant = Infer<typeof CoreErrorVariants>;

export class CoreError extends Error {
  constructor(public variant: CoreErrorVariant) {
    super();
  }

  static of = (() => ({
    ...CoreErrorVariants,
    parseRequestError: (values: { message: string }) => {
      return new CoreError(CoreErrorVariants.parseRequestError(values))
    },
    gameDomainError: (values: { reason: GameError }) => {
      return new CoreError(CoreErrorVariants.gameDomainError(values))
    },
  }))()
}
