import OrderService from '../services/OrderService';
import AbstractStrategy from './AbstractStrategy';

export default class DiffBasedStrategy extends AbstractStrategy {
  constructor({ baseCoinDiff }) {
    super();
    Object.assign(this, { baseCoinDiff });
  }

  static get NAME() {
    return 'difference';
  }

  getPriceNextOrder(coinExchangeModel, nextOrderType) {
    const priceOrder = coinExchangeModel.priceOrder * coinExchangeModel.amount;
    if (nextOrderType === OrderService.ORDER_SELL) {
      return priceOrder + this.baseCoinDiff;
    }

    if (nextOrderType === OrderService.ORDER_BUY) {
      return priceOrder - this.baseCoinDiff;
    }

    return null;
  }

  //privates
  isOrderPossible(coinExchangeModel, nextOrderType) {
    const diff = coinExchangeModel.priceChange.diff * coinExchangeModel.amount;
    if (nextOrderType === OrderService.ORDER_SELL && diff >= this.baseCoinDiff) {
      return true;
    }

    if (nextOrderType === OrderService.ORDER_BUY && diff <= -this.baseCoinDiff) {
      return true;
    }

    return false;
  }
}
