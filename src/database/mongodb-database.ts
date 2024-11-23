import { MongoClient, ServerApiVersion } from "mongodb";

export class MongodbDatabase {
  private client: MongoClient;

  constructor(uri: string) {
    this.client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
  }

  async connect() {
    try {
      await this.client.connect();
      await this.client.db('admin').command({ ping: 1 });
    } finally {
      await this.client.close();
    }
  }

  collection(collection: string) {
    return this.client.db().collection(collection);
  }
}
