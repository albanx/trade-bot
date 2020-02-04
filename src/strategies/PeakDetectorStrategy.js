import OrderService from '../services/OrderService';
import AbstractStrategy from './AbstractStrategy';

const MAX_PRICE_TO_STORE = 1000;
export default class PeakDetectorStratety extends AbstractStrategy {
  constructor({ threshold, prices, maxLimit }) {
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
    const priceTotal =
      coinExchangeModel.priceExchange * coinExchangeModel.amount;
    const diff = coinExchangeModel.priceChange.diff * coinExchangeModel.amount;
    this.addPrice(priceTotal);
    coinExchangeModel.strategy.params.prices = this.prices; //FIXME dirty trick

    if (
      nextOrderType === OrderService.ORDER_SELL &&
      this.isSellPossible(diff)
    ) {
      return true;
    }

    if (nextOrderType === OrderService.ORDER_BUY && this.isBuyPossible(diff)) {
      return true;
    }

    return false;
  }

  addPrice(priceTotal) {
    const diff = priceTotal - this.getLastPrice(priceTotal);
    const date = new Date();
    this.prices.push({ price: priceTotal, date, diff });
    this.prices = this.prices.slice(-MAX_PRICE_TO_STORE);
  }

  isSellPossible(diff) {
    if (diff > this.threshold) {
      appLog(`isSellPossible::over threshold ${diff} >  ${this.threshold}`);
      if (!this.isIncrementing(this.maxLimit)) {
        appLog('isSellPossible::OK::got maximum price ::', diff);
        return true;
      }
    }

    return false;
  }

  isBuyPossible(diff) {
    if (diff < -this.threshold) {
      appLog(`isBuyPossible::over threshold ${diff} <  -${this.threshold}`);
      if (this.isIncrementing(this.maxLimit)) {
        appLog('isBuyPossible::OK::got minimum price ::', diff);
        return true;
      }
    }

    return false;
  }

  isIncrementing(maxLimit) {
    const variationLast = this.prices
      .slice(-maxLimit)
      .map(item => item.diff)
      .reduce((acc, diff) => acc + diff);

    if (variationLast >= -3) {
      appLog('isIncrementing::', variationLast);
    } else {
      appLog('isDecrementing::', variationLast);
    }

    return variationLast >= 0;
  }

  getLastPrice(defValue) {
    return this.prices.length
      ? this.prices[this.prices.length - 1].price
      : defValue;
  }
}
