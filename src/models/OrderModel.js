export default class OrderModel {

  constructor(id, provider, coin, baseCoin, price, status, type, datetime) {
    this.id = id;
    this.provider = provider;
    this.coin = coin;
    this.baseCoin = baseCoin;
    this.price = price;
    this.status = status;
    this.type = type;
    this.datetime = datetime;
  }

  getId() {
    return this.id;
  }

  getProvider() {
    return this.provider;
  }

  getCoin() {
    return this.coin;
  }

  getBaseCoin() {
    return this.baseCoin;
  }

  getPrice() {
    return this.price;
  }

  getStatus() {
    return this.status;
  }

  getType() {
    return this.type;
  }

  getDatetime() {
    return this.datetime;
  }
}
