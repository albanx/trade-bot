import OrderService from '../services/OrderService';
import AbstractStrategy from './AbstractStrategy';

export default class DiffBasedStrategy extends AbstractStrategy {
  constructor({ baseCoinDiff, orders }) {
    super();
    this.baseCoinDiff = baseCoinDiff;
    this.orders = orders;
  }

  static get NAME() {
    return 'difference';
  }

  //privates
  getPriceNextOrder(coinExchangeModel, nextOrderType) {
    const priceOrder = coinExchangeModel.getPriceOrder();
    if (nextOrderType === OrderService.ORDER_SELL) {
      return priceOrder + this.baseCoinDiff;
    }

    if (nextOrderType === OrderService.ORDER_BUY) {
      return priceOrder - this.baseCoinDiff;
    }

    return null;
  }

  isOrderPossible(coinExchangeModel, nextOrderType) {
    const diff = coinExchangeModel.getPriceChange();
    if (nextOrderType === OrderService.ORDER_SELL && diff >= this.baseCoinDiff) {
      return true;
    }

    if (nextOrderType === OrderService.ORDER_BUY && diff <= -this.baseCoinDiff) {
      return true;
    }

    return false;
  }

  updatePriceChanges(coinExchangeModel) {
    const priceExchange = coinExchangeModel.getPriceExchange();
    const priceOrder = coinExchangeModel.getPriceOrder();
    const diff = priceExchange - priceOrder;
    coinExchangeModel.setPriceChange(diff);
  }
}
