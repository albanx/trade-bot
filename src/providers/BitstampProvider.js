import Provider from './ProviderInterface';
import env from '../../env';
import crypto from 'crypto';

const API_URL = env.API_URL_BITSTAMP;

export default class BitstampProvider extends Provider {
  constructor(request, coin, baseCoin, quantity) {
    super();
    this.request = request;
    this.coin = coin;
    this.baseCoin = baseCoin;
    this.quantity = quantity;
  }

  getName() {
    return 'bitstamp';
  }

  async sellCoin(rate) {
    const pair = this.getBasePair();
    const response = await this.request.post({
      url: `${API_URL}/sell/market/${pair}/`,
      form: {
        ...this.generateAuth(),
        amount: this.quantity
      },
      json: true
    });

    return this.getResponse(response);
  }

  async buyCoin(rate) {
    const pair = this.getBasePair(this.coin);
    const response = await this.request.post({
      url: `${API_URL}/buy/market/${pair}/`,
      form: {
        ...this.generateAuth(),
        amount: this.quantity
      },
      json: true
    });

    return this.getResponse(response);
  }

  getCoin() {
    return this.coin;
  }

  getBasePair() {
    return `${this.coin}${this.baseCoin}`.toLowerCase();
  }

  async getMarket(coinPair) {
    return await this.request.get({
      url: `${API_URL}/ticker/${coinPair}/`,
      json: true
    });
  }

  async getCoinPrice() {
    const market = await this.getMarket(this.getBasePair());
    return parseFloat(market.last);
  }



  async getOrder(id) {
    const response = await this.request.post({
      url: `${API_URL}/order_status/`,
      form: {
        ...this.generateAuth(),
        id
      },
      json: true
    });

    return response;
  }

  async isOrderOpen(id) {
    const order = await this.getOrder(id);
    return !order.finished;
  }

  async getBalance() {
    const timestamp = new Date().getTime().toString();
    const request = await this.request.post({
      url: `${API_URL}/balance/${this.getBasePair()}/`,
      form: this.generateAuth(),
      json: true
    });

    return request;
  }

  generateAuth() {
    const timestamp = new Date().getTime().toString();

    return {
      key: env.API_KEY_BITSTAMP,
      signature: this.generateSign(timestamp),
      nonce: timestamp
    }
  }

  generateSign(timestamp) {
    const message = timestamp + env.CUSTOMER_ID_BITSTAMP + env.API_KEY_BITSTAMP;
    return crypto.createHmac('sha256', env.API_SECRET_BITSTAMP).update(message).digest('hex').toUpperCase();
  }

  getResponse(response) {
    return {
      success: response.id !== undefined,
      orderId: response.id,
      type: response.type === 1 ? 'sell' : 'buy',
      price: response.price,
      amount: response.amount
    }
  }
}
