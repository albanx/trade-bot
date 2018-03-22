import AbstractCollection from "./AbstractCollection";

const COLLECTION_NAME = 'price';
export default class CoinCollection extends AbstractCollection {
  async getCollection() {
    const collection = await this.db.collection(COLLECTION_NAME);
    collection.createIndex({ name: 1, market: 1 }, { unique: true });
    return collection;
  }
}
