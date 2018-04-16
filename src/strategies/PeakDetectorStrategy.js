import AbstractStrategy from './AbstractStrategy';

export default class PeakDetectorStratety extends AbstractStrategy {
  constructor({prices}) {
    super();
    this.prices = prices;

  }

  addPrice(price) {
    this.prices.push(price);
  }

  hasMaxValue() {

  }

  isGrowing() {
    const length = this.prices.length;
    return this.prices[length-2] < this.prices[length-1];
  }

  isLowering() {
    return !this.isGrowing();
  }

}
