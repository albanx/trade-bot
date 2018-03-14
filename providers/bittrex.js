export default class BitTrex {
  

  constructor(request) {
    this.request = request;
    this.apiPublic = 'https://bittrex.com/api/v1.1/public/';
    this.baseCoin = 'USDT';
  }

  async getCoinPrice(coinPair) {
      return await this.request.get({
          url:  this.apiPublic + 'getticker',
          qs: {
              market: coinPair
          },
          json: true
      });
  }

  async getMarket(coinPair) {
    return await this.request.get({
        url:  this.apiPublic + 'getmarketsummary',
        qs: {
            market: coinPair
        },
        json: true
    });
  }

  getBasePair(coin) {
    return `${this.baseCoin}-${coin}`;
  }

  async getPrice(coin) {
    const market = await this.getMarket(this.getBasePair(coin));
    return market.result[0].Last;  
  }
}
