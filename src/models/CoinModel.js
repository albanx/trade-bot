export default class CoinModel {
  constructor(code, name, supply) {
    this.code = code;
    this.name = name;
    this.supply = supply;
  }

  getCode() {
    return this.code;
  }

  getName() {
    return this.name;
  }

}
