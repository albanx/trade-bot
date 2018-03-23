export default class OrderService {

  constructor(collection, threshold) {
    this.co = collection;
    this.threshold = threshold;
  }

  static get ACTION_SELL() {
    return 'sell';
  }

  static get ACTION_BUY() {
    return 'buy';
  }

  static get NO_ACTION() {
    return 'No Action';
  }

  static isValidOrderType(orderType) {
    return [OrderService.ACTION_BUY, OrderService.ACTION_SELL].indexOf(orderType) > -1;
  }

  addToHistory(data) {
    this.co.insert({...data, time: new Date()});
  }

  async findNextOrderType(coin, market, percentChange) {
    const last = await this.co.findOne(
      {coin, market},
      {sort: {time: -1}, limit: 1}
    );

    if (Math.abs(percentChange) > this.threshold) {
      const nextOrderBasedOnMarket = percentChange > 0 ? this.ACTION_SELL : this.ACTION_BUY;
      const nextOrderBasedOnLast = last ? this.getNextOrderType(last.action) : nextOrderBasedOnMarket;

      if (!nextOrderBasedOnLast || nextOrderBasedOnLast === nextOrderBasedOnMarket) {
        return nextOrderBasedOnMarket;
      }
    }

    return OrderService.NO_ACTION;
  }

  getNextOrderType(orderType) {

    if (orderType === OrderService.ACTION_BUY) {
      return OrderService.ACTION_SELL
    }

    if (orderType === OrderService.ACTION_SELL) {
      return OrderService.ACTION_BUY
    }

    return null;
  }

  getPriceNextAction(priceAction, nextAction) {
    if (nextAction === OrderService.ACTION_SELL) {
      return priceAction + priceAction * this.threshold / 100;
    }

    if (nextAction === OrderService.ACTION_BUY) {
      return priceAction - priceAction * this.threshold / 100;
    }

    return null;
  }

  async makeOrder(provider, priceMarket, orderType, coinPriceModel) {

    if (OrderService.isValidOrderType(orderType)) {
      let response = {};
      if (orderType === OrderService.ACTION_SELL) {
        response = await provider.sellCoin(priceMarket);
      } else if (orderType === OrderService.ACTION_BUY) {
        response = await provider.buyCoin(priceMarket);
      }

      return response.orderId;
    }

    return null;
  }

  async getOrders(status) {
    const orders = await this.co.find({status});
    return orders.toArray();
  }
}
