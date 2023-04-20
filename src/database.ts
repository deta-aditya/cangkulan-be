import pgp, { IDatabase } from 'pg-promise';

export interface DatabaseConfig {
  hostname: string
  port: number
  database: string
  username: string
  password: string
}

export interface Database {
  query: <TResult, TParams>(queryString: string, params?: TParams) => Promise<Array<TResult>>
  queryOne: <TResult, TParams>(queryString: string, params?: TParams) => Promise<TResult>
  executeOne: <TResult, TParams>(queryString: string, params?: TParams) => Promise<TResult>
}

export function create(connection: DatabaseConfig): Database {
  const database = pgp()(connection)
  return new PgPromiseDatabase(database)
}

// TODO: use better error handling
class PgPromiseDatabase implements Database {
  database: IDatabase<{}>

  constructor(database: IDatabase<{}>) {
    this.database = database
  }

  async query<TResult, TParams>(queryString: string, params?: TParams): Promise<Array<TResult>> {
    try {
      const result = await this.database.any<TResult>(queryString, params)
      return result
    } catch (error) {
      throw error
    }
  };

  async queryOne<TResult, TParams>(queryString: string, params?: TParams): Promise<TResult> {
    return this.executeOne(queryString, params)
  }

  async executeOne<TResult, TParams>(queryString: string, params?: TParams): Promise<TResult> {
    try {
      const result = await this.database.oneOrNone<TResult>(queryString, params);
      if (result === null) {
        throw new EmptyRowError()
      }
      return result
    } catch (error) {
      throw error;
    }
  }
}

export class EmptyRowError extends Error {
  constructor() {
    super('No rows returned when executing query')
    this.name = 'EmptyRowError'
  }
}