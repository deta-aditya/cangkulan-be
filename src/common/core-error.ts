import { GameError } from "@/games/models/game-error";
import { having, Infer, unionOf } from "./union";

export const CoreErrors = unionOf({
  parseRequestError: having<{ message: string }>(),
  gameDomainError: having<{ reason: GameError }>(),
});

export type CoreError = Infer<typeof CoreErrors>;
