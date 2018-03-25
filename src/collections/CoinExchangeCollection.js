import AbstractCollection from "./AbstractCollection";

export default class CoinExchangeCollection extends AbstractCollection {
  constructor(db) {
    super(db);
    this.name = 'coin_exchange';
  }

  async getCoinsToTrade() {
    const c = await this.getCollection();
    const coins  = await c.find();
    return coins.toArray();
  }
}
