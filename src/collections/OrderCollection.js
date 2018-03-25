import AbstractCollection from "./AbstractCollection";

export default class OrderCollection extends AbstractCollection {
  constructor(db) {
    super(db);
    this.name = 'orders';
  }

  async getLastOrder(where) {
    const c = await this.getCollection();
    return await c.findOne(where, {sort: {time: -1}, limit: 1});
  }
}
