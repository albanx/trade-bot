export default class Provider {
  getBasePair(coin) {
    return `${this.baseCoin}-${coin}`;
  }

  setBaseCoin(coin) {
    this.baseCoin = coin;
  }

  getBaseCoin() {
    return this.baseCoin;
  }

  async sellCoin() {

  }

  async buyCoin() {

  }
}
