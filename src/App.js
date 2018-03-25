import config from '../config';
import Store from './Store';
import CoinExchangeService from './services/CoinExchangeService';
import CoinExchangeCollection from './collections/CoinExchangeCollection';
import OrderCollection from './collections/OrderCollection';
import OrderService from './services/OrderService';
import Dashboard from './Dashboard';
import TradeMonitorService from "./services/TradeMonitorService";
import createCoinExchange from "./factories/CoinExchangeFactory";
import BitstampExchange from "./exchanges/BitstampExchange";
import EventMediator from "./EventMediator";
import EVENTS from "./Events";


const mediator = new EventMediator();
// const dashboard = new Dashboard({});

mediator.on(EVENTS.MONITOR_START, () =>{
  console.log('MONITOR_START');
});

mediator.on(EVENTS.MONITOR_LOAD_COINS, () =>{
  console.log('MONITOR_LOAD_COINS');
});

mediator.on(EVENTS.MONITOR_INIT_COINS, () =>{
  console.log('MONITOR_INIT_COINS');
});

mediator.on(EVENTS.MONITOR_CHECK_COIN, (model) =>{
  console.log('MONITOR_CHECK_COIN', model);
});

const LTC_BITSTAMP = createCoinExchange({
  coin: 'LTC',
  exchange: BitstampExchange.NAME,
  baseCoin: 'EUR',
  amount: 2
});

const tradeCoins = [LTC_BITSTAMP];


const startTradingBot = async () => {
  const store = new Store(config.HOST_MONGO, config.DB_NAME);
  const database = await store.getDatabase();
  const coinExchangeCollection = new CoinExchangeCollection(database);
  const orderCollection = new OrderCollection(database);

  const coinExchangeService = new CoinExchangeService(coinExchangeCollection);
  const orderService = new OrderService(orderCollection, 6);

  const tradeService = new TradeMonitorService(coinExchangeService, orderService, mediator, tradeCoins);
  await tradeService.start().catch(e => console.log(e));
};

startTradingBot().catch(e => console.log('error', e));


