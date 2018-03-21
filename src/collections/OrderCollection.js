export default class OrderCollection {
  constructor(db) {
    this.db = db;
  }

  async getCollection() {
    const collection = await this.db.collection('orders');
    return collection;
  }
}
