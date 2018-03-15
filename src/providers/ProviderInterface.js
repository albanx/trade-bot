export default class Provider {
  getBasePair(coin) {
    return `${this.baseCoin}-${coin}`;
  }

  setBaseCoin(coin) {
    this.baseCoin = coin;
  }
}
