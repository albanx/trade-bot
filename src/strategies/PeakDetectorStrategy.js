import AbstractStrategy from './AbstractStrategy';

export default class PeakDetectorStratety extends AbstractStrategy {
  constructor({prices}) {
    super();
    this.prices = prices;
    this.marketCap = [];
    this.lastPrice = null;
    this.threshold = 10;

    this.highPeaks = [];
    this.lowPeaks = [];
  }

  static get NAME() {
    return 'peak';
  }

  getPriceNextOrder(coinExchangeModel, nextOrderType) {

    return coinExchangeModel.priceExchange;
  }

  //private methods
  isOrderPossible(coinExchangeModel, nextOrderType) {
    const diff = coinExchangeModel.getPriceChange();
    if (nextOrderType === OrderService.ORDER_SELL && diff > 0) {
      return true;
    }

    if (nextOrderType === OrderService.ORDER_BUY && diff < 0) {
      return true;
    }

    return false;
  }

  addPrice(price) {
    this.prices.push(price);
  }

  addMarketCap(val) {
    this.marketCap.push(val);
  }

  isHightPeak() {
    const variation = this.priceVariation(); //100  101 102 103 104
    const marketVar = this.marketVariation();
    if(variation > this.threshold) {
      return true;
    }

    return false;
  }

  isLowPeak() {
    const variation = this.priceVariation(); //100 - 99 - 97 - 96 - 96.5 -95
    const marketVar = this.marketVariation();
    if(variation < -this.threshold) {
      return true;
    }

    return false;
  }

  priceVariation() {
    return this.prices.slice(1).map((val, i) => val - this.prices[i]).reduce((a, b) => a + b);
  }

  marketVariation() {
    return this.marketCap.slice(1).map((val, i) => val - this.marketCap[i]).reduce((a, b) => a + b);
  }
}
