import AbstractCollection from "./AbstractCollection";

export default class OrderCollection extends AbstractCollection {
  async findLastOrder(coinExchangeId) {
    return await this.collection.findOne({coinExchangeId}, {sort: {$natural: -1}});
  }
}
