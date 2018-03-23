import Provider from './ProviderInterface';
import env from '../../env';

const API_URL = 'https://bittrex.com/api/v1.1';

export default class BittrexProvider extends Provider {
  constructor(request, baseCoin, tradeQuantity) {
    super();
    this.request = request;
    this.baseCoin = baseCoin;
    this.quantity = tradeQuantity;
  }

  static get NAME() {
    return 'bittrex';
  }

  async getMarket(coinPair) {
    return await this.request.get({
      url: `${API_URL}/public/getmarketsummary`,
      qs: {
        market: coinPair
      },
      json: true
    });
  }

  async getCoinPrice(coin) {
    const market = await this.getMarket(this.getBasePair(coin));
    return parseFloat(market.result[0].Last);
  }

  async sellCoin(coin, rate) {
    const market = this.getBasePair(coin);
    const response = await this.request.get({
      url: `${API_URL}/market/selllimit?apikey=${env.API_KEY_BITTREX}`,
      qs: {
        market,
        quantity: this.quantity,
        rate
      },
      json: true
    });

    return this.getResponse(response);
  }

  async buyCoin(coin, rate) {
    const market = this.getBasePair(coin);
    const response = await this.request.get({
      url: `${API_URL}/market/buylimit?apikey=${env.API_KEY_BITTREX}`,
      qs: {
        market,
        quantity: this.quantity,
        rate
      },
      json: true
    });

    return this.getResponse(response);
  }

  async getOrder(id) {
    const response = await this.request.get({
      url: `${API_URL}/account/getorder`,
      qs: {
        uuid: id
      },
      json: true
    });

    return response;
  }

  async isOrderOpen(id) {
    const order = await this.getOrder(id);
    return order.isOpen;
  }

  getResponse(response) {
    return {
      success: response.success,
      orderId: response.result.uuid
    }
  }
}
