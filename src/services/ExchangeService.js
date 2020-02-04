import createExchange from '../factories/ExchangeFactory';

export class ExchangeService {
  constructor() {
    this.exchanges = {};
  }

  async getBalances(name) {
    const exchange = this.getExchange(name);
    const balance = await exchange.getBalances();

    return balance;
  }

  getExchange(name) {
    if (!this.exchanges[name]) {
      this.exchanges[name] = createExchange(name);
    }

    return this.exchanges[name];
  }
}
