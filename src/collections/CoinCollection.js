export default class CoinCollection {
  constructor(db) {
    this.db = db;
  }

  async getCollection() {
    const collection = await this.db.collection('price');
    collection.createIndex({ name: 1, market: 1 }, { unique: true });
    return collection;
  }
}