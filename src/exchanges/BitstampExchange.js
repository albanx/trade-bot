import ExchangeInterface from './ExchangeInterface';
import env from '../../env';
import crypto from 'crypto';
import OrderService from '../services/OrderService';
import { RequestException } from '../Exceptions';

const API_URL = env.BITSTAMP_API_URL;
const API_KEY = env.BITSTAMP_API_KEY;
const API_SECRET = env.BITSTAMP_API_SECRET;
const CUSTOMER_ID = env.BITSTAMP_CUSTOMER_ID;

export default class BitstampExchange extends ExchangeInterface {
  constructor(request) {
    super();
    this.request = request;
  }

  static get NAME() {
    return 'bitstamp';
  }

  getCoin() {
    return this.coin;
  }

  getBasePair(coin, baseCoin) {
    return `${coin}${baseCoin}`.toLowerCase();
  }

  async makeOrder(coinExchangeModel, orderType) {
    if (OrderService.isValidOrderType(orderType)) {
      const endPoint = orderType === OrderService.ORDER_SELL ? 'sell' : 'buy';

      const coin = coinExchangeModel.getCoin();
      const baseCoin = coinExchangeModel.getBaseCoin();
      const amount = coinExchangeModel.getAmount();
      const pair = this.getBasePair(coin, baseCoin);
      const url = `${API_URL}/${endPoint}/market/${pair}/`;
      const json = true;
      const form = { ...this.generateAuth(), amount };
      const response = await this.request.post({ url, form, json }).catch(
        e => { throw new RequestException('BitstampExchange::makeOrder', e) }
      );
      return this.getResponse(response);
    }
  }

  async getCoinPrice(coin, baseCoin) {
    const pair = this.getBasePair(coin, baseCoin);
    const url = `${API_URL}/ticker/${pair}/`;
    const json = true;
    const response = await this.request.get({ url, json }).catch(
      e => { throw new RequestException('BitstampExchange::getCoinPrice', e) }
    );

    return parseFloat(response.last);
  }

  async getOrder(id) {
    const url = `${API_URL}/order_status/`;
    const json = true;
    const form = { ...this.generateAuth(), id };

    return await this.request.post({ url, form, json });
  }

  async isOrderOpen(id) {
    const order = await this.getOrder(id);
    return !order['finished'];
  }

  async getBalance(coin, baseCoin) {
    const url = `${API_URL}/balance/${this.getBasePair(coin, baseCoin)}/`;
    const json = true;
    const form = { ...this.generateAuth(), id };

    return await this.request.post({ url, form, json });
  }

  generateAuth() {
    const nonce = new Date().getTime().toString();
    const key = API_KEY;
    const signature = this.generateSign(nonce);

    return { key, signature, nonce };
  }

  generateSign(timestamp) {
    const message = timestamp + CUSTOMER_ID + API_KEY;
    return crypto
      .createHmac('sha256', API_SECRET)
      .update(message)
      .digest('hex')
      .toUpperCase();
  }

  getResponse(response) {
    return {
      success: response.status !== 'error',
      orderId: response.id,
      type:
        response.type === 1 ? OrderService.ORDER_SELL : OrderService.ORDER_BUY,
      price: response.price,
      amount: response.amount,
      error: response.reason ? response.reason.__all__.join(',') : ''
    };
  }
}
