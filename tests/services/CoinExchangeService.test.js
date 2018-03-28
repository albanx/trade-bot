import CoinExchangeService from "../../src/services/CoinExchangeService";
import Collection from '../__mocks__/Collection';
import CoinExchangeCollection from "../../src/collections/CoinExchangeCollection";
import coinExchangeModel from '../__mocks__/coinExchangeModel';

describe('CoinExchangeService', () => {
  const coll = new Collection();
  const repo = new CoinExchangeCollection(coll);
  const instance = new CoinExchangeService(repo);

  beforeEach(() => {
  });

  test('create an instance', () => {
    expect(instance instanceof CoinExchangeService).toBe(true);
  });

  test('getCoinsToTrade', async () => {
    expect.assertions(1);
    const coins = await instance.getCoinsToTrade();
    expect(coins).toEqual([]);
  });


  it('saveCoinExchange', async () => {
    expect.assertions(1);
    const id = await instance.saveCoinExchange(coinExchangeModel);
    expect(id).toEqual('id_123');
  });
});
