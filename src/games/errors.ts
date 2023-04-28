export type FindGameByIdError =
  | CorruptGameData
  | GameNotFound
  | DatabaseError

interface CorruptGameData {
  kind: 'corrupt-game-data',
  id: number
  reason: string
}

interface GameNotFound {
  kind: 'game-not-found',
  id: number
}

interface DatabaseError {
  kind: 'database-error',
  error: Error
}

export function CorruptGameData(id: number, reason: string): FindGameByIdError {
  return { kind: 'corrupt-game-data', id, reason }
}

export function GameNotFound(id: number): FindGameByIdError {
  return { kind: 'game-not-found', id }
}

export function DatabaseError(error: Error): FindGameByIdError {
  return { kind: 'database-error', error }
}

export function when<T>(error: unknown, cases: {
  corruptGameData: (id: number, reason: string) => T,
  gameNotFound: (id: number) => T,
  databaseError: (error: Error) => T,
  _: () => T,
}) {
  if (typeof error === 'object' && error !== null && 'kind' in error) {
    if (error.kind === 'corrupt-game-data' && 'id' in error && typeof error.id === 'number' && 'reason' in error && typeof error.reason === 'string') {
      return cases.corruptGameData(error.id, error.reason)
    }
    if (error.kind === 'game-not-found' && 'id' in error && typeof error.id === 'number') {
      return cases.gameNotFound(error.id)
    }
    if (error.kind === 'database-error' && 'error' in error && error.error instanceof Error) {
      return cases.databaseError(error.error)
    }
  }
  return cases._()
}
