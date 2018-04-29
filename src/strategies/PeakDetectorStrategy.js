import OrderService from '../services/OrderService';
import AbstractStrategy from './AbstractStrategy';

const MAX_PRICE_TO_STORE = 1000;
export default class PeakDetectorStratety extends AbstractStrategy {
  constructor({threshold, prices, maxLimit}) {
    super();
    Object.assign(this, { threshold, prices, maxLimit });
  }

  static get NAME() {
    return 'peak';
  }

  getPriceNextOrder(coinExchangeModel, nextOrderType) {
    const priceOrder = coinExchangeModel.priceOrder * coinExchangeModel.amount;
    if (nextOrderType === OrderService.ORDER_SELL) {
      return priceOrder + this.threshold;
    }

    if (nextOrderType === OrderService.ORDER_BUY) {
      return priceOrder - this.threshold;
    }

    return null;
  }

  isOrderPossible(coinExchangeModel, nextOrderType) {
    const price = coinExchangeModel.priceExchange * coinExchangeModel.amount;
    const diff = coinExchangeModel.priceChange.diff * coinExchangeModel.amount;
    this.addPrice(price);

    if (nextOrderType === OrderService.ORDER_SELL && this.isSellPossible(diff)) {
      return true;
    }

    if (nextOrderType === OrderService.ORDER_BUY && this.isBuyPossible(diff)) {
      return true;
    }

    return false;
  }

  addPrice(price) {
    const diff = price - this.getLastPrice(price);
    const date = new Date();
    this.prices.push({price, date, diff});
    this.prices = this.prices.slice(-MAX_PRICE_TO_STORE);
  }

  isSellPossible(diff) {
    if (diff > this.threshold && !this.isIncrementing(this.maxLimit)) {
      appLog('isSellPossible::OK', diff);
      return true;
    }
    
    return false;
  }

  isBuyPossible(diff) {
    if (diff < -this.threshold && this.isIncrementing(this.maxLimit)) {
      appLog('isBuyPossible::OK', diff);
      return true;
    }

    return false;
  }

  isIncrementing(maxLimit) {
    const variationLast = this.prices
      .slice(-maxLimit)
      .map(item => item.diff)
      .reduce((acc, diff) => acc + diff);

    appLog('isIncrementing::', variationLast);
    return variationLast >= 0;
  }

  getLastPrice(defValue) {
    return this.prices.length ? this.prices[this.prices.length-1].price : defValue;
  }
}
