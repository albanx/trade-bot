import createCoinExchange from "../factories/CoinExchangeFactory";

export default class CoinExchangeService {
  constructor(coinExchangeStore) {
    this.store = coinExchangeStore;
  }

  async getCoinsToTrade() {
    const coins = await this.store.getCoinsToTrade();
    return coins.map(c => createCoinExchange(c));
  }

  async saveCoinExchange(coinExchangeModel) {
    return await this.store.save(coinExchangeModel);
  }
}
