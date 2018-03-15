import mongo from 'mongodb';

export default class Store {
  constructor(host, dbName) {
    if (this.db) {
      return this;
    }

    this.host = host;
    this.dbName = dbName;
    this.db = this.openDb();
  }

  async openDb() {
    const client = await mongo.MongoClient.connect(this.host);
    return client.db(this.dbName);
  }
}
