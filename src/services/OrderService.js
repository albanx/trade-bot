import OrderModel from "../models/OrderModel";
import createOrder from "../factories/OrderFactory";
import createStrategy from "../factories/StrategyFactory";

export default class OrderService {

  constructor(collection) {
    this.store = collection;
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

  async getOrderType(coinExchangeModel, preview = false) {
    const configStrategy = coinExchangeModel.getStrategy();
    const strategy = createStrategy(configStrategy.name, configStrategy.params);
    const lastOrder = await this.getLastOrder(coinExchangeModel.getId());
    return strategy.getNextOrderType(coinExchangeModel, lastOrder, preview);
  }

  getPreviewPriceNextOrder(coinExchangeModel, nextOrderType) {
    const configStrategy = coinExchangeModel.getStrategy();
    const strategy = createStrategy(configStrategy.name, configStrategy.params);
    return strategy.getPriceNextOrder(coinExchangeModel, nextOrderType);
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
