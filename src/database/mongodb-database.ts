import { MongoClient, ServerApiVersion } from "npm:mongodb";

export class MongodbDatabase {
  private client: MongoClient;

  constructor(uri: string) {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });
  }

  async connect() {
    try {
      await this.client.connect();
      await this.client.db("admin").command({ ping: 1 });
    } catch (_err) {
      console.error(`Error when connecting to MongoDb: ${_err}`);
    }
  }

  collection(collection: string) {
    return this.client.db().collection(collection);
  }
}
