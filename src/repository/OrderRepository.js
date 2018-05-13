import AbstractRepository from "./AbstractRepository";

export default class OrderRepository extends AbstractRepository {
  async findLastOrder(coinExchangeId) {
    return await this.collection.findOne({coinExchangeId});
  }
}
