import { z } from "zod";

export const GameConfigSchema = z.object({
  cardsPerPlayer: z.number(),
  numberOfPlayers: z.number(),
})
export type GameConfig = z.infer<typeof GameConfigSchema>

// Explaination: This is the original database-stored shape of a game.
// We'll probably need a more fitting shape for business process later.
export const DbRowGameSchema = z.object({
  id: z.number(),
  config: GameConfigSchema,
  state: z.object({
    joinedPlayers: z.array(z.number()),
  })
})
export type Game = z.infer<typeof DbRowGameSchema>
export type DbRowGame = z.infer<typeof DbRowGameSchema>
export type PureGame = z.infer<typeof DbRowGameSchema>
