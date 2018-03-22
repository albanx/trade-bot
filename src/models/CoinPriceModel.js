export default class CoinPriceModel {
  constructor(coin, provider, priceProvider, priceOrder, priceStart, lastUpdate) {
    this.coin = coin;
    this.provider = provider;
    this.priceProvider = priceProvider;
    this.priceOrder = priceOrder;
    this.priceStart = priceStart;
    this.lastUpdate = lastUpdate;
  }

  getCoin() {
    return this.coin;
  }

  getProvider() {
    return this.provider;
  }
}
