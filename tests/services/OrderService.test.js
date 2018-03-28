import OrderService from "../../src/services/OrderService";
import Collection from '../__mocks__/Collection';
import coinExchangeModel from '../__mocks__/coinExchangeModel';
import OrderCollection from "../../src/collections/OrderCollection";

describe('CoinExchangeService', () => {
  const coll = new Collection();
  const repo = new OrderCollection(coll);
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
