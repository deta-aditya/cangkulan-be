import { hasNothing, Infer, unionOf } from "@/common/union";

export const GameActions = unionOf({
  addPlayer: hasNothing(),
});

export type GameAction = Infer<typeof GameActions>;
