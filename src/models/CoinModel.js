export default class CoinModel {
  constructor(code, name, supply) {
    this.name = name;
    this.code = code;
    this.supply = supply;
  }

  getName() {
    return this.name;
  }

  getCode() {
    return this.code;
  }
}
