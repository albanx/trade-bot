import OrderService from "../../src/services/OrderService";
import Collection from '../__mocks__/Collection';
import OrderRepository from "../../src/collections/OrderRepository";

describe('CoinExchangeService', () => {
  const coll = new Collection();
  const repo = new OrderRepository(coll);
  const instance = new OrderService(repo);

  beforeEach(() => {
  });

  test('create an instance', () => {
    expect(instance instanceof OrderService).toBe(true);
  });

  test('test get order type', () => {
    expect(OrderService.ORDER_BUY).toEqual('buy');
    expect(OrderService.ORDER_SELL).toEqual('sell');
  });

  test('isValidOrderType', () => {
    expect(OrderService.isValidOrderType('sell')).toBe(true);
    expect(OrderService.isValidOrderType('buy')).toEqual(true);
    expect(OrderService.isValidOrderType('asdasd')).toEqual(false);
  });

  test('getNextOrderTypeBasedOnLastOrder', () => {
    expect.assertions(1);
    instance.getNextOrderTypeBasedOnLastOrder()
  });

  ///getNextOrderTypeBasedOnLastOrder
  // test('getCoinsToTrade', async () => {
  //   expect.assertions(1);
  //   const coins = await instance.getCoinsToTrade();
  //   expect(coins).toEqual([]);
  // });
  //
  //
  // it('saveCoinExchange', async () => {
  //   expect.assertions(1);
  //   const id = await instance.saveCoinExchange(coinExchangeModel);
  //   expect(id).toEqual('id_123');
  // });
});
