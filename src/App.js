import config from '../config';
import Store from './Store';
import CoinExchangeService from './services/CoinExchangeService';
import CoinExchangeRepository from './collections/CoinExchangeRepository';
import OrderRepository from './collections/OrderRepository';
import OrderService from './services/OrderService';
import Dashboard from './Dashboard';
import TradeMonitorService from './services/TradeMonitorService';
import createCoinExchange from './factories/CoinExchangeFactory';
import BitstampExchange from './exchanges/BitstampExchange';
import EventMediator from './EventMediator';
import EVENTS from './Events';
import DashboardViewer from './DashboardViewer';
import SimpleStrategy from './strategies/SimpleStrategy';

const ltcBitstamp = createCoinExchange({
  coin: 'LTC',
  exchange: BitstampExchange.NAME,
  baseCoin: 'EUR',
  amount: 1,
  strategy: { 
    name: SimpleStrategy.NAME, 
    params: {
      lowThreshold: -15, highThreshold: 20, frequency: 60
    }
  }
});

const tradeCoins = [ltcBitstamp];
const dashboard = new Dashboard({});
global.appLog = (msg) => {
  dashboard.log(msg);
};

const startTradingBot = async () => {
  const store = new Store(config.HOST_MONGO, config.DB_NAME);
  const database = await store.getDatabase();
  const coinExchangeCollection = await database.createCollection('coin_exchange');
  const orderCollection = await database.createCollection('orders');

  const coinExchangeRepo = new CoinExchangeRepository(coinExchangeCollection);
  const orderRepo = new OrderRepository(orderCollection);

  const mediator = new EventMediator();

  const coinExchangeService = new CoinExchangeService(coinExchangeRepo);
  const orderService = new OrderService(orderRepo, 15);
  const tradeService = new TradeMonitorService(
    coinExchangeService,
    orderService,
    mediator,
    tradeCoins
  );

  //display events
  const dashboardViewer = new DashboardViewer(dashboard, orderService);
  mediator.on(EVENTS.MONITOR_START, () => dashboard.log('Monitor start'));
  mediator.on(EVENTS.MONITOR_LOAD_COINS, () => dashboard.log('Loading coins'));
  mediator.on(EVENTS.MONITOR_CYCLE, async coins => {
    const orders = await orderService.getOrders();
    dashboardViewer.showCoins(coins);
    dashboardViewer.showNextOrders(coins);
    dashboardViewer.showCurrentOrders(orders);
  });
  mediator.on('MONITOR_MAKE_ORDER', (coinExchangeModel, orderType) =>
    dashboard.log('Making order', orderType)
  );
  mediator.on('MONITOR_ORDER_DONE', () => dashboard.log('Order done'));
  mediator.on('MONITOR_ORDER_ERROR', error =>
    dashboard.error('Order error: ', error)
  );

  await tradeService.start();
};

startTradingBot().catch(e => dashboard.error(e.message, e.error));
