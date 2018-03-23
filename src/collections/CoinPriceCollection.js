import AbstractCollection from "./AbstractCollection";

const COLLECTION_NAME = 'price';
export default class CoinCollection extends AbstractCollection {

  constructor(db) {
    super(db);
  }

  async getCollection() {
    if(!this.collection) {
      this.collection = await this.db.collection(COLLECTION_NAME);
      this.collection.createIndex({name: 1, market: 1}, {unique: true});
    }

    return Promise.resolve(this.collection);
  }

  async saveCoinStartPrice(where, price) {
    this.collection.update(where, )
  }
}
