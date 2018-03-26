import OrderModel from "../models/OrderModel";
import createOrder from "../factories/OrderFactory";

export default class OrderService {

  constructor(collection, threshold) {
    this.store = collection;
    this.threshold = threshold;
  }

  static get ORDER_SELL() {
    return 'sell';
  }

  static get ORDER_BUY() {
    return 'buy';
  }

  static isValidOrderType(orderType) {
    return [OrderService.ORDER_SELL, OrderService.ORDER_BUY].indexOf(orderType) > -1;
  }

  async getNextOrderTypeBasedOnLastOrder(coinExchangeId) {
    const lastOrder = await this.getLastOrder(coinExchangeId);

    if (lastOrder) {
      const orderType = lastOrder.getOrderType();
      if (orderType === OrderService.ORDER_BUY) {
        return OrderService.ORDER_SELL;
      }

      if (orderType === OrderService.ORDER_SELL) {
        return OrderService.ORDER_BUY;
      }
    }

    return null;
  }

  async getLastOrder(coinExchangeId) {
    const order = await this.store.findLastOrder(coinExchangeId);

    if (order) {
      return createOrder(order);
    }

    return null;
  }

  async getNextOrderType(coinExchangeId, percentChange, preview = false) {
    if (Math.abs(percentChange) > this.threshold || preview) {
      const nextOrderBasedOnMarket = percentChange > 0 ? OrderService.ORDER_SELL : OrderService.ORDER_BUY;
      const nextOrderBasedOnLast = await this.getNextOrderTypeBasedOnLastOrder(coinExchangeId);

      return nextOrderBasedOnLast ? nextOrderBasedOnLast : nextOrderBasedOnMarket;
    }

    return null;
  }

  getPriceNextOrder(priceOrder, nextOrderType) {
    if (nextOrderType === OrderService.ORDER_SELL) {
      return priceOrder + priceOrder * this.threshold / 100;
    }

    if (nextOrderType === OrderService.ORDER_BUY) {
      return priceOrder - priceOrder * this.threshold / 100;
    }

    return null;
  }

  async getOrders() {
    const orders = await this.store.findAll();
    return orders.map(o => createOrder(o));
  }

  async saveOrder(coinExchangeModel, exchangeOrderId, orderType) {
    const coinExchangeId = coinExchangeModel.getId();
    const coin = coinExchangeModel.getCoin();
    const exchange = coinExchangeModel.getExchange();
    const baseCoin = coinExchangeModel.getBaseCoin();
    const priceOrder = coinExchangeModel.getPriceOrder();
    const status = 'open';

    const order = createOrder({
      coinExchangeId,
      exchangeOrderId,
      coin,
      baseCoin,
      exchange,
      priceOrder,
      orderType,
      status
    });

    await this.store.saveModel(order);
  }
}
