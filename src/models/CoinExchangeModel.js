import AbstractModel from "./AbstractModel";

export default class CoinExchangeModel extends AbstractModel {
  constructor({_id, coin, exchange, baseCoin, amount, priceExchange, priceOrder, priceStart, priceChange, lastUpdate}) {
    super();
    this._id = _id;
    this.coin = coin;
    this.exchange = exchange;
    this.baseCoin = baseCoin;
    this.amount = amount;
    this.priceExchange = priceExchange;
    this.priceOrder = priceOrder;
    this.priceStart = priceStart;
    this.priceChange = priceChange;
    this.lastUpdate = lastUpdate;
  }

  getCoin() {
    return this.coin;
  }

  getBaseCoin() {
    return this.baseCoin;
  }

  getExchange() {
    return this.exchange;
  }

  getAmount() {
    return this.amount;
  }

  getPriceExchange() {
    return this.priceExchange;
  }

  getPriceStart() {
    return this.priceStart;
  }

  getPriceOrder() {
    return this.priceOrder;
  }

  getPriceChange() {
    return this.priceChange;
  }

  setPriceExchange(price) {
    this.priceExchange = price;
  }

  setPriceOrder(price) {
    this.priceOrder = price;
  }

  setPriceStart(price) {
    this.priceStart = price;
  }

  setLastUpdate(date) {
    this.lastUpdate = date;
  }

  setAmount(amount) {
    this.amount = 1;
  }

  setPriceChange(value) {
    this.priceChange = value;
  }
}
