import BitstampExchange from '../../src/exchanges/BitstampExchange';
import request from '../__mocks__/request';
import coinExchangeModel from '../__mocks__/coinExchangeModel';

describe('BitstampProvider', () => {

  const instance = new BitstampExchange(request);

  test('create an instance', () => {
    expect(instance instanceof BitstampExchange).toBe(true);
  });

  test('NAME', () => {
    expect(BitstampExchange.NAME).toBe('bitstamp');
  });

  it('sellCoin', async () => {
    expect.assertions(5);
    const data = await instance.sellCoin(coinExchangeModel);
    expect(data.orderId).toBeDefined();
    expect(data.type).toBe('sell');
    expect(data.success).toBe(true);
    expect(data.price).toBe(111);
    expect(data.amount).toBe(2);
  });

  it('buyCoin', async () => {
    expect.assertions(5);
    const data = await instance.buyCoin(coinExchangeModel);
    expect(data.orderId).toBeDefined();
    expect(data.type).toBe('buy');
    expect(data.success).toBe(true);
    expect(data.price).toBe(123);
    expect(data.amount).toBe(2);
  });

});
