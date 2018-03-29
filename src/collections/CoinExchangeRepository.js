import AbstractRepository from "./AbstractRepository";

export default class CoinExchangeRepository extends AbstractRepository {
  async getCoinsToTrade() {
    const coins  = await this.collection.find();
    return coins.toArray();
  }
}
