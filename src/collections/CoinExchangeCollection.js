import AbstractCollection from "./AbstractCollection";

export default class CoinExchangeCollection extends AbstractCollection {
  async getCoinsToTrade() {
    const coins  = await this.collection.find();
    return coins.toArray();
  }
}
