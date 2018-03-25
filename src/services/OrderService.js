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

  static getNextOrderTypeBasedOnLastOrder(orderType) {

    if (orderType === OrderService.ORDER_BUY) {
      return OrderService.ORDER_BUY
    }

    if (orderType === OrderService.ORDER_SELL) {
      return OrderService.ORDER_SELL
    }

    return null;
  }

  async getNextOrderType(coinExchangeId, percentChange) {
    const last = await this.store.getLastOrder({coinExchangeId});

    if (Math.abs(percentChange) > this.threshold) {
      const nextOrderBasedOnMarket = percentChange > 0 ? OrderService.ORDER_SELL : OrderService.ORDER_BUY;
      const nextOrderBasedOnLast = last ? this.getNextOrderTypeBasedOnLastOrder(last.action) : nextOrderBasedOnMarket;

      if (!nextOrderBasedOnLast || nextOrderBasedOnLast === nextOrderBasedOnMarket) {
        return nextOrderBasedOnMarket;
      }
    }

    return null;
  }

  getPriceNextAction(priceAction, nextAction) {
    if (nextAction === OrderService.ORDER_SELL) {
      return priceAction + priceAction * this.threshold / 100;
    }

    if (nextAction === OrderService.ORDER_BUY) {
      return priceAction - priceAction * this.threshold / 100;
    }

    return null;
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
