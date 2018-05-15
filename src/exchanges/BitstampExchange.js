import ExchangeInterface from './ExchangeInterface';
import env from '../../env';
import crypto from 'crypto';
import OrderService from '../services/OrderService';
import { AppRequestException } from '../Exceptions';

const API_URL = env.BITSTAMP_API_URL;
const API_KEY = env.BITSTAMP_API_KEY;
const API_SECRET = env.BITSTAMP_API_SECRET;
const CUSTOMER_ID = env.BITSTAMP_CUSTOMER_ID;

export default class BitstampExchange extends ExchangeInterface {
  constructor(fetch) {
    super();
    this.fetch = fetch;
    // this.startWebSocket();
  }

  static get NAME() {
    return 'bitstamp';
  }

  static get FEE() {
    return 0.25/100;
  }

  getBasePair(coin, baseCoin) {
    return `${coin}${baseCoin}`.toLowerCase();
  }

  async makeOrder(coinExchangeModel, orderType) {
    if (OrderService.isValidOrderType(orderType)) {
      const endPoint = orderType === OrderService.ORDER_SELL ? 'sell' : 'buy';
      const coin = coinExchangeModel.coin;
      const baseCoin = coinExchangeModel.baseCoin
      const amount = coinExchangeModel.amount;
      const pair = this.getBasePair(coin, baseCoin);
      const url = `${API_URL}/${endPoint}/market/${pair}/`;
      const params = { ...this.generateAuth(), amount };
      const timeout = 10000;

      const json = await this.fetch.post(url, { 
        params, 
        timeout 
      }).catch(
        e => { throw new AppRequestException('BitstampExchange::makeOrder', e) }
      );

      return this.getResponse(json);
    }
  }

  async getCoinPrice(coin, baseCoin) {
    const pair = this.getBasePair(coin, baseCoin);
    const url = `${API_URL}/ticker/${pair}/`;
    const json = await this.fetch.get(url);
    const price = parseFloat(json.last);
    const priceWithFee = price * BitstampExchange.FEE + price;

    return priceWithFee;
  }

  async getOrderStatus(id) {
    const url = `${API_URL}/order_status/`;
    const params = { ...this.generateAuth(), id };
    const timeout = 10000;

    return response = await this.fetch.post(url, { params, timeout }).catch(
      e => { throw new AppRequestException('BitstampExchange::getOrderStatus', e) }
    );
  }

  async isOrderOpen(id) {
    const order = await this.getOrderStatus(id);
    return !order['finished'];
  }

  async getBalance(coin, baseCoin) {
    const url = `${API_URL}/balance/${this.getBasePair(coin, baseCoin)}/`;
    const params = { ...this.generateAuth(), id };
    const response = await this.fetch.post(url, { params, method }).catch(
      e => { throw new AppRequestException('BitstampExchange::getOrderStatus', e) }
    );

    return response;
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
