import AbstractStrategy from './AbstractStrategy';

export default class PeakDetectorStratety extends AbstractStrategy {
  constructor() {
    super();
    this.prices = [];
    this.threshold = 10;
    this.lastMaxPrice = 0;
    this.lastMinPrice = -1;
    this.variation = [];
  }

  static get NAME() {
    return 'peak';
  }

  getPriceNextOrder(coinExchangeModel, nextOrderType) {
    return coinExchangeModel.priceExchange;
  }

  //private methods
  isOrderPossible(coinExchangeModel, nextOrderType) {
    const price = coinExchangeModel.priceExchange;
    this.addPrice(price);
    const diff = coinExchangeModel.getPriceChange();
    if (nextOrderType === OrderService.ORDER_SELL && price > this.lastMaxPrice) {
      this.lastMaxPrice = price;
      return false;
    }

    if (nextOrderType === OrderService.ORDER_BUY && price < this.lastMinPrice) {
      this.lastMinPrice = price;
      return false;
    }

    return false;
  }

  addPrice(price) {
    const diff = price - this.prices[this.prices.length-1];
    this.variation.push(Math.sign(diff));
    this.prices.push(price);
  }

  isHighPeak() {
    const variation = this.priceVariation(); //100  101 102 103 104
    if(variation > this.threshold) {
      return true;
    }

    return false;
  }

  isLowPeak() {
    const variation = this.priceVariation(); //100 - 99 - 97 - 96 - 96.5 -95
    if(variation < -this.threshold) {
      return true;
    }

    return false;
  }

  getAvarage() {
    return this.prices.reduce((a, b) => a + b)/this.prices.length;
  }

  getMedian() {
    
  }

  priceVariation(number) {
    const prices  = this.prices.slice(10);
    return prices.slice(1).map((val, i) => val - this.prices[i]).reduce((a, b) => a + b);
  }
}
