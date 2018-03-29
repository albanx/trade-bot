import OrderService from "../services/OrderService";

export default class SimpleStrategy {
  constructor(price, threshold, orderHistory) {
    this.price = price;
    this.threshold = threshold;
    this.threshold = threshold;
  }

  static get NAME() {
    return 'simple'
  }

  getPriceChanges(priceExchange) {
    return (priceExchange - this.price) * 100 / Math.max(this.price, priceExchange);
  }

  getOrderType() {
    const percentChange = this.getPriceChanges();

    if (Math.abs(percentChange) >= this.threshold) {
      return percentChange >= 0 ? OrderService.ORDER_SELL : OrderService.ORDER_BUY;
    }

    return null;
  }
}
