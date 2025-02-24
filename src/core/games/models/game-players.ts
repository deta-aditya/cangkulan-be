import type { Player } from "@/core/games/models/player.ts";
import { NumberOfPlayers } from "@/core/games/models/number-of-players.ts";

export class GamePlayers {
  constructor(
    private maxPlayers: NumberOfPlayers,
    private list: Player[],
  ) {}

  isFull() {
    return this.list.length === this.maxPlayers.value;
  }

  add(player: Player) {
    if (!this.isFull()) {
      const newList = [...this.list, player];
      return new GamePlayers(this.maxPlayers, newList);
    }
    return this;
  }
}
