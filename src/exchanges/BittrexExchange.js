import ExchangeInterface from './ExchangeInterface';
import env from '../../env';
import OrderService from '../services/OrderService';

const API_URL = env.BITTREX_API_URL;
const API_KEY = env.BITTREX_API_KEY;

export default class BittrexExchange extends ExchangeInterface {
  constructor(request) {
    super();
    this.request = request;
  }

  static get NAME() {
    return 'bittrex';
  }

  getBasePair(coin, baseCoin) {
    return `${baseCoin}-${coin}`.toLowerCase();
  }

  async getMarket(coinPair) {
    return await this.request.get({
      url: `${API_URL}/public/getticker`,
      qs: {
        market: coinPair
      },
      json: true
    });
  }

  async getCoinPrice(coin, baseCoin) {
    const market = this.getBasePair(coin, baseCoin);
    const url = `${API_URL}/public/getticker`;
    const qs = {  market };
    const json = true;
    const timeout = 10000;
    const response = await this.request.get({ url, qs, json, timeout }).catch(
      e => { 
        throw new AppRequestException('BittrexExchange::getCoinPrice', e) 
      }
    );
    return parseFloat(response.result.Last);
  }

  async makeOrder(coinExchangeModel, orderType) {
    if (OrderService.isValidOrderType(orderType)) {
      const endPoint = orderType === OrderService.ORDER_SELL ? 'selllimit' : 'buylimit';
      const coin = coinExchangeModel.coin;
      const baseCoin = coinExchangeModel.baseCoin;

      const quantity = coinExchangeModel.amount;
      const rate = coinExchangeModel.priceExchange;
      const market = this.getBasePair(coin, baseCoin);
      const url = `${API_URL}/market/${endPoint}?apikey=${env.API_KEY_BITTREX}`;
      const json = true;
      const qs = { market, quantity, rate };
      const timeout = 10000;
      const response = await this.request.get({ url, qs, json, timeout }).catch(
        e => { throw new AppRequestException('BittrexExchange::makeOrder', e) }
      );
      return this.getResponse(response);
    }
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
