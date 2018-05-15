import config from '../config';
import CoinExchangeService from './services/CoinExchangeService';
import CoinExchangeRepository from './repository/CoinExchangeRepository';
import OrderRepository from './repository/OrderRepository';
import OrderService from './services/OrderService';
import TradeMonitorService from './services/TradeMonitorService';
import createCoinExchange from './factories/CoinExchangeFactory';
import BitstampExchange from './exchanges/BitstampExchange';
import EventMediator from './EventMediator';
import EVENTS from './Events';
import SimpleStrategy from './strategies/SimpleStrategy';
import DiffBasedStrategy from './strategies/DiffBasedStrategy';
import PeakDetectorStrategy from './strategies/PeakDetectorStrategy';
import LocalStorageStore from './store/localStorage/LocalStorageStore';

// const ltcBitstamp = createCoinExchange({
//   coin: 'LTC',
//   exchange: BitstampExchange.NAME,
//   baseCoin: 'EUR',
//   amount: 1,
//   tradeMode: TradeMonitorService.TRADE_MODE_SIMULATION,
//   strategy: { 
//     name: SimpleStrategy.NAME,
//     params: {
//       lowThreshold: -15, highThreshold: 20, frequency: 60
//     }
//   }
// });

// const ltcBitstampDiff = createCoinExchange({
//   coin: 'LTC',
//   exchange: BitstampExchange.NAME,
//   baseCoin: 'EUR',
//   amount: 1,
//   tradeMode: TradeMonitorService.TRADE_MODE_SIMULATION,
//   strategy: { 
//     name: DiffBasedStrategy.NAME, 
//     params: {
//       baseCoinDiff: 2
//     }
//   }
// });

// const btcBitstampDiff = createCoinExchange({
//   coin: 'BTC',
//   exchange: BitstampExchange.NAME,
//   baseCoin: 'EUR',
//   amount: 0.06551237,//TODO avaiable
//   priceOrder: 7693,
//   tradeMode: TradeMonitorService.TRADE_MODE_SIMULATION,
//   strategy: { 
//     name: DiffBasedStrategy.NAME, 
//     params: {
//       baseCoinDiff: 100
//     }
//   }
// });

const btcBitstampPeak = createCoinExchange({
  coin: 'BTC',
  exchange: BitstampExchange.NAME,
  baseCoin: 'EUR',
  amount: 0.06551237,//TODO avaiable
  priceOrder: 7693,
  tradeMode: TradeMonitorService.TRADE_MODE_SIMULATION,
  lastOrderType: OrderService.ORDER_SELL,
  strategy: {
    name: PeakDetectorStrategy.NAME, 
    params: {//NOTE these are references will reflect in DB
      threshold: 5, prices: [], maxLimit: 30   
    }
  }
});

// const btcBitstampPeak2 = createCoinExchange({
//   coin: 'BTC',
//   exchange: BitstampExchange.NAME,
//   baseCoin: 'EUR',
//   amount: 0.06431237,//TODO avaiable
//   priceOrder: 7693,
//   tradeMode: TradeMonitorService.TRADE_MODE_SIMULATION,
//   lastOrderType: OrderService.ORDER_BUY,
//   strategy: {
//     name: PeakDetectorStrategy.NAME, 
//     params: {//NOTE these are references will reflect in DB
//       threshold: 40, prices: [], maxLimit: 30   
//     }
//   }
// });

const tradeCoins = [btcBitstampPeak];
global.appLog = (...msg) => {
  console.log(msg);
};

global.appWarning = (msg, e) => {
  console.warning(msg, e.stack);
};

const store = new LocalStorageStore();

const startTradingBot = async () => {
  const coinExchangeCollection = await store.createCollection('coin_exchange');
  const orderCollection = await store.createCollection('orders');

  const coinExchangeRepo = new CoinExchangeRepository(coinExchangeCollection);
  const orderRepo = new OrderRepository(orderCollection);

  const mediator = new EventMediator();

  const coinExchangeService = new CoinExchangeService(coinExchangeRepo);
  const orderService = new OrderService(orderRepo);
  const tradeService = new TradeMonitorService(
    coinExchangeService,
    orderService,
    mediator,
    tradeCoins
  );

  //display events
  const startWrapper = async () => {
    await tradeService.start().catch(e => {
      console.error(e.message, e.error);
      console.log('Retry in 10 seconds...');
      setTimeout(() => startWrapper(), 10000);
    });
  }

  startWrapper();
};

startTradingBot().catch(e => console.error(e.message, e.error));
