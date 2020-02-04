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
  constructor(request) {
    super();
    this.request = request;
    // this.startWebSocket();
  }

  static get NAME() {
    return 'bitstamp';
  }

  static get FEE() {
    return 0.25 / 100;
  }

  getBasePair(coin, baseCoin) {
    return `${coin}${baseCoin}`.toLowerCase();
  }

  async makeOrder(coinExchangeModel, orderType) {
    if (OrderService.isValidOrderType(orderType)) {
      const endPoint = orderType === OrderService.ORDER_SELL ? 'sell' : 'buy';
      const coin = coinExchangeModel.coin;
      const baseCoin = coinExchangeModel.baseCoin;
      const amount = coinExchangeModel.amount;
      const pair = this.getBasePair(coin, baseCoin);
      const url = `${API_URL}/${endPoint}/market/${pair}/`;
      const json = true;
      const form = { ...this.generateAuth(), amount };
      const timeout = 10000;
      const response = await this.request
        .post({ url, form, json, timeout })
        .catch(e => {
          throw new AppRequestException('BitstampExchange::makeOrder', e);
        });
      return this.getResponse(response);
    }
  }

  async getCoinPrice(coin, baseCoin, fee = BitstampExchange.FEE) {
    const pair = this.getBasePair(coin, baseCoin);
    const url = `${API_URL}/ticker/${pair}/`;
    const json = true;
    const timeout = 10000;
    const response = await this.request.get({ url, json, timeout }).catch(e => {
      throw new AppRequestException('BitstampExchange::getCoinPrice', e);
    });
    const price = parseFloat(response.last);
    const priceWithFee = price * fee + price;

    return priceWithFee;
  }

  async getOrderStatus(id) {
    const url = `${API_URL}/order_status/`;
    const json = true;
    const form = { ...this.generateAuth(), id };
    const timeout = 10000;
    return await this.request.post({ url, form, json, timeout }).catch(e => {
      throw new AppRequestException('BitstampExchange::getOrderStatus', e);
    });
  }

  async isOrderOpen(id) {
    const order = await this.getOrderStatus(id);
    return !order['finished'];
  }

  async getBalance(coin, baseCoin) {
    const url = `${API_URL}/balance/${this.getBasePair(coin, baseCoin)}/`;
    const json = true;
    const form = this.generateAuth();

    const balance = await this.request.post({ url, form, json }).catch(e => {
      throw new AppRequestException('BitstampExchange::getBalance', e);
    });

    return await this.formatBalance(balance);
  }

  async formatBalance(json) {
    const balances = [];
    Object.keys(json).forEach(key => {
      const type = key.split('_');
      const coin = type[0];
      const balanceType = type[1];

      if (balanceType === 'available') {
        balances.push({
          coin: coin,
          exchange: BitstampExchange.NAME,
          balance: json[key],
          value: 0,
          valueCurr: 'eur'
        });
      }
    });

    return await Promise.all(
      balances
        .filter(item => item.balance > 0)
        .map(async item => {
          item.value =
            (await this.getCoinPrice(item.coin, item.valueCurr, 0)) *
            item.balance;
          return item;
        })
    );
  }

  async getBalances() {
    const url = `${API_URL}/balance/`;
    const json = true;
    const form = this.generateAuth();

    const balance = await this.request.post({ url, form, json }).catch(e => {
      throw new AppRequestException('BitstampExchange::getBalance', e);
    });

    return this.formatBalance(balance);
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
