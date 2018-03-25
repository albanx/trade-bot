import BitstampProvider from '../../src/exchanges/BitstampExchange';
import request from '../__mocks__/request';

describe('BitstampProvider', () => {
  const instance = new BitstampProvider(request, 'eur', 1);

  test('create an instance', () => {
    expect(instance instanceof BitstampProvider).toBe(true);
  });

  test('getName', () => {
    expect(instance.getName()).toBe('bitstamp');
  });

  it('sellCoin', async () => {
    expect.assertions(5);
    const data = await instance.sellCoin('LTC', 123);
    expect(data.orderId).toBeDefined();
    expect(data.type).toBe('sell');
    expect(data.success).toBe(true);
    expect(data.price).toBe(123);
    expect(data.amount).toBe(2);
  });

  it('buyCoin', async () => {
    expect.assertions(5);
    const data = await instance.buyCoin('LTC', 123);
    expect(data.orderId).toBeDefined();
    expect(data.type).toBe('buy');
    expect(data.success).toBe(true);
    expect(data.price).toBe(123);
    expect(data.amount).toBe(2);
  });

});
