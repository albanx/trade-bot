export default class CoinPriceModel {
  constructor(coin, baseCoin, provider, priceOrder, priceStart, lastUpdate) {
    this.coin = coin;
    this.provider = provider;
    this.baseCoin = baseCoin;
    this.priceOrder = priceOrder;
    this.priceStart = priceStart;
    this.lastUpdate = lastUpdate;
  }

  getCoin() {
    return this.coin;
  }

  getBaseCoin() {
    return this.baseCoin;
  }

  getProvider() {
    return this.provider;
  }

  getPriceStart() {
    return this.priceStart;
  }

  getPriceOrder() {
    return this.priceOrder;
  }

  setPriceOrder(price) {
    this.priceOrder = price;
  }
}
