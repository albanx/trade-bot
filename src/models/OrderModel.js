import AbstractModel from "./AbstractModel";

export default class OrderModel extends AbstractModel {

  constructor(params) {
    super();
    Object.assign(this, params);
  }

  getId() {
    return this._id;
  }

  getCoinExchangeId() {
    return this.coinExchangeId;
  }

  getExchangeOrderId() {
    return this.exchangeOrderId;
  }

  getExchange() {
    return this.exchange;
  }

  getCoin() {
    return this.coin;
  }

  getBaseCoin() {
    return this.baseCoin;
  }

  getPriceOrder() {
    return this.priceOrder;
  }

  getStatus() {
    return this.status;
  }

  getOrderType() {
    return this.orderType;
  }

  getDateCreated() {
    return this.dateCreated;
  }
}
