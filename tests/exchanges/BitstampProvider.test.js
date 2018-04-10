import BitstampExchange from '../../src/exchanges/BitstampExchange';
import request from '../__mocks__/request';
import coinExchangeModel from '../__mocks__/coinExchangeModel';
import OrderService from '../../src/services/OrderService';

describe('BitstampProvider', () => {

  const instance = new BitstampExchange(request);

  test('create an instance', () => {
    expect(instance instanceof BitstampExchange).toBe(true);
  });

  test('NAME', () => {
    expect(BitstampExchange.NAME).toBe('bitstamp');
  });

  test('FEE', () => {
    expect(BitstampExchange.FEE).toBe(0.0025);
  });

  test('getBasePair', () => {
    expect(instance.getBasePair('LTC', 'eur')).toBe('ltceur');
  });

  it('makeOrder sell', async () => {
    expect.assertions(5);
    const data = await instance.makeOrder(coinExchangeModel, OrderService.ORDER_SELL);
    expect(data.orderId).toBeDefined();
    expect(data.type).toBe('sell');
    expect(data.success).toBe(true);
    expect(data.price).toBe(111);
    expect(data.amount).toBe(2);
  });

  it('makeOrder buy', async () => {
    expect.assertions(5);
    const data = await instance.makeOrder(coinExchangeModel,  OrderService.ORDER_BUY);
    expect(data.orderId).toBeDefined();
    expect(data.type).toBe('buy');
    expect(data.success).toBe(true);
    expect(data.price).toBe(123);
    expect(data.amount).toBe(2);
  });

  it('makeOrder null', async () => {
    expect.assertions(1);
    const data = await instance.makeOrder(coinExchangeModel, 'not an order type');
    expect(data).toBeUndefined();
  });

  it('getCoinPrice', async () => {
    expect.assertions(1);
    const data = await instance.getCoinPrice('ltc', 'eur');
    expect(typeof data).toBe('number');
  });

  it('getOrder', async () => {
    expect.assertions(1);
    const data = await instance.getOrderStatus('5ab');
    expect(data.status).toBe('finished');
  });

  it('isOrderOpen', async () => {
    expect.assertions(1);
    const data = await instance.isOrderOpen('5ab');
    expect(data).toBeTruthy();
  });
});
