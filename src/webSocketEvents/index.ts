export function playerJoined(params: { playerId: number, gameId: number, canStartGame: boolean }) {
  const { gameId, playerId, canStartGame } = params
  return {
    event: 'player-joined',
    message: `Player ${playerId} has joined!`,
    data: {
      gameId,
      playerId,
      canStartGame,
    },
  }
}

export function playerLeft(params: { playerId: number, gameId: number }) {
  const { gameId, playerId } = params
  return {
    event: 'player-left',
    message: `Player ${playerId} has left!`,
    data: {
      gameId,
      playerId,
    },
  }
}