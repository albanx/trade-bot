export default class OrderModel {

  constructor(providerOrderId, provider, coin, baseCoin, priceOrder, orderType, status, datetime) {
    this.providerOrderId = providerOrderId;
    this.provider = provider;
    this.coin = coin;
    this.baseCoin = baseCoin;
    this.priceOrder = priceOrder;
    this.orderType = orderType;
    this.status = status;
    this.datetime = datetime;
  }

  getOrderId() {
    return this.providerOrderId;
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

  getPriceOrder() {
    return this.priceOrder;
  }

  getStatus() {
    return this.status;
  }

  getOrderType() {
    return this.orderType;
  }

  getDatetime() {
    return this.datetime;
  }
}
