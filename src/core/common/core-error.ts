import { GameError } from "@/core/games/models/game-error.ts";
import { having, Infer, unionOf } from "./union.ts";

export const CoreErrors = unionOf({
  parseRequestError: having<{ message: string }>(),
  gameDomainError: having<{ reason: GameError }>(),
});

export type CoreError = Infer<typeof CoreErrors>;
