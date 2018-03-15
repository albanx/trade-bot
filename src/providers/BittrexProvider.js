import Provider from './ProviderInterface';

export default class BittrexProvider extends Provider {
  constructor(request, baseCoin) {
    super();
    this.request = request;
    this.apiPublic = 'https://bittrex.com/api/v1.1/public/';
    this.baseCoin = baseCoin;
  }

  async getMarket(coinPair) {
    return await this.request.get({
      url: this.apiPublic + 'getmarketsummary',
      qs: {
        market: coinPair
      },
      json: true
    });
  }

  async getCoinPrice(coin) {
    const market = await this.getMarket(this.getBasePair(coin));
    return market.result[0].Last;
  }

  async sellCoin(coin) {
    console.log('sellOnBittrex::', coin);
  }

  async buyCoin(coin) {
    console.log('buyOnBittrex::', coin);
  }
}
