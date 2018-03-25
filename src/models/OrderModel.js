import AbstractModel from "./AbstractModel";

export default class OrderModel extends AbstractModel {

  constructor({id, coinExchangeId, exchangeOrderId, coin, baseCoin, exchange, priceOrder, orderType, status, dateCreated}) {
    super();
    this._id = id;
    this.exchangeOrderId = exchangeOrderId;
    this.exchange = exchange;
    this.coin = coin;
    this.baseCoin = baseCoin;
    this.priceOrder = priceOrder;
    this.orderType = orderType;
    this.status = status;
    this.dateCreated = dateCreated;
  }

  getId() {
    return this._id;
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
