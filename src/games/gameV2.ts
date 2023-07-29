import { Game } from "./schemas"

export function addPlayer(game: Game, playerId: number): Game {
  const joinedPlayersSet = new Set(game.state.joinedPlayers)
  joinedPlayersSet.add(playerId)

  const newJoinedPlayers = [...joinedPlayersSet]
  const newState = { joinedPlayers: newJoinedPlayers }
  const newGame = { ...game, state: newState }

  return newGame
}

export function canStartGame(game: Game) {
  return game.config.numberOfPlayers === game.state.joinedPlayers.length
}
