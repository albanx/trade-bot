import OrderModel from "../models/OrderModel";
import createOrder from "../factories/OrderFactory";
import createStrategy from "../factories/StrategyFactory";

export default class OrderService {

  constructor(collection) {
    this.store = collection;
    this._cache
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

  async getLastOrder(coinExchangeId) {
    const order = await this.store.findLastOrder(coinExchangeId);
    if (order) {
      return createOrder(order);
    }

    return null;
  }

  getStrategy(strategy) {
    return createStrategy(strategy.name, strategy.params);
  }
  
  async getOrderType(coinExchangeModel, preview = false) {
    const lastOrder = await this.getLastOrder(coinExchangeModel.getId());
    return this.getStrategy(coinExchangeModel.strategy).getNextOrderType(coinExchangeModel, lastOrder, preview);
  }

  getPreviewPriceNextOrder(coinExchangeModel, nextOrderType) {
    return this.getStrategy(coinExchangeModel.strategy).getPriceNextOrder(coinExchangeModel, nextOrderType);
  }

  async getOrders() {
    const orders = await this.store.findAll();
    return orders.map(o => createOrder(o));
  }

  async saveOrder(coinExchangeModel, exchangeOrderId, orderType) {
    const coinExchangeId = coinExchangeModel.getId();
    const coin = coinExchangeModel.coin;
    const exchange = coinExchangeModel.exchange;
    const baseCoin = coinExchangeModel.baseCoin;
    const priceOrder = coinExchangeModel.priceOrder;
    const amount = coinExchangeModel.amount;
    const value = priceOrder * amount;
    const status = 'open';
    const dateCreated = new Date();
    const order = createOrder({
      coinExchangeId,
      exchangeOrderId,
      coin,
      baseCoin,
      exchange,
      priceOrder,
      amount,
      value,
      orderType,
      status,
      dateCreated
    });

    await this.store.saveModel(order);
  }
}
