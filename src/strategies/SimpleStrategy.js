import OrderService from '../services/OrderService';
import AbstractStrategy from './AbstractStrategy';

export default class SimpleStrategy extends AbstractStrategy {
  constructor({ lowThreshold, highThreshold, frequency }) {
    super();
    Object.assign(this, { lowThreshold, highThreshold, frequency });
  }

  static get NAME() {
    return 'simple';
  }

  //privates
  getPriceNextOrder(coinExchangeModel, nextOrderType) {
    const priceOrder = coinExchangeModel.priceOrder;
    if (nextOrderType === OrderService.ORDER_SELL) {
      return priceOrder + priceOrder * this.highThreshold / 100;
    }

    if (nextOrderType === OrderService.ORDER_BUY) {
      return priceOrder + priceOrder * this.lowThreshold / 100;
    }

    return null;
  }

  isOrderPossible(coinExchangeModel, nextOrderType) {
    const diff = coinExchangeModel.priceExchange.percent;
    if (nextOrderType === OrderService.ORDER_SELL && diff >= this.highThreshold) {
      return true;
    }

    if (nextOrderType === OrderService.ORDER_BUY && diff <= this.lowThreshold) {
      return true;
    }

    return false;
  }
}
