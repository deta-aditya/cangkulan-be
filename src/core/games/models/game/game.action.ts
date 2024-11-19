import { hasNothing, Infer, unionOf } from "@/core/common/union";

export const GameActions = unionOf({
  addPlayer: hasNothing(),
});

export type GameAction = Infer<typeof GameActions>;
