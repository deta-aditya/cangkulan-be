import { z } from "zod";

// Explaination: This is the original database-stored shape of a game.
// We'll probably need a more fitting shape for business process later.
export const DbRowGameSchema = z.object({
  id: z.number(),
  config: z.object({
    cardsPerPlayer: z.number(),
    numberOfPlayers: z.number(),
  }),
  state: z.object({
    joinedPlayers: z.array(z.number()),
  })
})
export type Game = z.infer<typeof DbRowGameSchema>

export const DEFAULT_GAME_STATE = {
  joinedPlayers: [],
}