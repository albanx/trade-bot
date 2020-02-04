import config from '../config';
import CoinExchangeService from './services/CoinExchangeService';
import CoinExchangeRepository from './repository/CoinExchangeRepository';
import OrderRepository from './repository/OrderRepository';
import OrderService from './services/OrderService';
import Dashboard from './Dashboard';
import TradeMonitorService from './services/TradeMonitorService';
import createCoinExchange from './factories/CoinExchangeFactory';
import BitstampExchange from './exchanges/BitstampExchange';
import EventMediator from './EventMediator';
import EVENTS from './Events';
import DashboardViewer from './DashboardViewer';
import SimpleStrategy from './strategies/SimpleStrategy';
import DiffBasedStrategy from './strategies/DiffBasedStrategy';
import PeakDetectorStrategy from './strategies/PeakDetectorStrategy';
import createStore from './factories/StoreFactory';
import MongoStore from './store/mongodb/MongoStore';
import { ExchangeService } from './services/ExchangeService';

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

// const btcBitstampPeak = createCoinExchange({
//   coin: 'BTC',
//   exchange: BitstampExchange.NAME,
//   baseCoin: 'EUR',
//   amount: 0.06551237,//TODO avaiable
//   priceOrder: 7693,
//   tradeMode: TradeMonitorService.TRADE_MODE_SIMULATION,
//   lastOrderType: OrderService.ORDER_SELL,
//   strategy: {
//     name: PeakDetectorStrategy.NAME,
//     params: {//NOTE these are references will reflect in DB
//       threshold: 5, prices: [], maxLimit: 30
//     }
//   }
// });

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

// const ripple = createCoinExchange({
//   coin: 'XRP',
//   exchange: BitstampExchange.NAME,
//   baseCoin: 'EUR',
//   amount: 148.87386417,
//   priceOrder: 0.23221,
//   tradeMode: TradeMonitorService.TRADE_MODE_LIVE,
//   lastOrderType: OrderService.ORDER_BUY,
//   strategy: {
//     name: PeakDetectorStrategy.NAME,
//     params: {
//       threshold: 15,
//       prices: [],
//       maxLimit: 30
//     }
//   }
// });

// const eth = createCoinExchange({
//   coin: 'ETH',
//   exchange: BitstampExchange.NAME,
//   baseCoin: 'EUR',
//   amount: 1.71617824,
//   priceOrder: 174,
//   tradeMode: TradeMonitorService.TRADE_MODE_LIVE,
//   lastOrderType: OrderService.ORDER_BUY,
//   strategy: {
//     name: PeakDetectorStrategy.NAME,
//     params: {
//       threshold: 15,
//       prices: [],
//       maxLimit: 30
//     }
//   }
// });

const tradeCoins = [];
const dashboard = new Dashboard({});
global.appLog = (...msg) => {
  dashboard.log(msg);
};

global.appWarning = (msg, e) => {
  dashboard.warning(msg, e.stack);
};

const store = createStore(MongoStore.NAME, {
  host: config.HOST_MONGO,
  dbName: config.DB_NAME
});

const startDatabase = async () => {
  dashboard.log('Connecting to database...');
  const coinExchangeCollection = await store.createCollection('coin_exchange');
  const orderCollection = await store.createCollection('orders');

  const coinExchangeRepo = new CoinExchangeRepository(coinExchangeCollection);
  const orderRepo = new OrderRepository(orderCollection);

  return { orderRepo, coinExchangeRepo };
};

const loadBalances = async () => {
  const exchangeService = new ExchangeService();
  const balances = await exchangeService.getBalances(BitstampExchange.NAME);
  const balancesAsArray = balances.map(b => [
    b.exchange,
    b.coin,
    b.balance,
    `${b.value} ${b.valueCurr}`
  ]);
  dashboard.addBalancesRows(balancesAsArray);
};

const startTradingBot = async () => {
  const { orderRepo, coinExchangeRepo } = await startDatabase();
  const mediator = new EventMediator();
  const coinExchangeService = new CoinExchangeService(coinExchangeRepo);
  const orderService = new OrderService(orderRepo);
  const tradeService = new TradeMonitorService(
    coinExchangeService,
    orderService,
    mediator,
    tradeCoins
  );

  await loadBalances();

  //display events
  const dashboardViewer = new DashboardViewer(dashboard, orderService);
  mediator.on(EVENTS.MONITOR_START, () => dashboard.log('Monitor start'));
  mediator.on(EVENTS.MONITOR_LOAD_COINS, () => dashboard.log('Loading coins'));
  mediator.on(EVENTS.MONITOR_CYCLE, async coins => {
    const orders = await orderService.getOrders();
    dashboardViewer.showCoins(coins);
    dashboardViewer.showCurrentOrders(orders);
  });
  mediator.on('MONITOR_MAKE_ORDER', (coinExchangeModel, orderType) =>
    dashboard.log(
      'Making order',
      orderType,
      coinExchangeModel
        .getId()
        .toString()
        .substring(0, 4)
    )
  );
  mediator.on('MONITOR_ORDER_DONE', () => dashboard.log('Order done'));
  mediator.on('MONITOR_ORDER_ERROR', error =>
    dashboard.error('Order error: ', error)
  );

  const startWrapper = async () => {
    await tradeService.start().catch(e => {
      dashboard.error(e.message, e.error);
      dashboard.log('Retry in 10 seconds...');
      setTimeout(() => startWrapper(), 10000);
    });
  };

  startWrapper();
};

startTradingBot().catch(e => dashboard.error(e.message, e.error, e.stack));
