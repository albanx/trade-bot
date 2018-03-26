import AbstractCollection from "./AbstractCollection";

export default class OrderCollection extends AbstractCollection {
  constructor(db) {
    super(db);
    this.name = 'orders';
  }

  async findLastOrder(coinExchangeId) {
    const coll = await this.getCollection();
    return await coll.findOne({coinExchangeId}, {sort: {$natural: -1}});
  }
}
