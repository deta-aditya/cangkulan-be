import { PureGame } from "./schemas";

export type UpdateGame = (gameId: number, game: PureGame) => Promise<void>