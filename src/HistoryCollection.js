export default class HistoryCollection {
  constructor(db) {
    this.db = db;
  }

  async getCollection() {
    const collection = await this.db.collection('history');
    return collection;
  }
}