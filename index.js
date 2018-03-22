import request from 'request-promise-native';
import config from './config';
import Store from './src/Store';
import CoinService from './src/services/CoinService';
import CoinCollection from './src/collections/CoinPriceCollection';
import OrderCollection from './src/collections/OrderCollection';
import BittrexProvider from './src/providers/BittrexProvider';
import OrderService from './src/services/OrderService';
import BitstampProvider from "./src/providers/BitstampProvider";
import Dashboard from './src/Dashboard';
import TradeService from "./src/services/TradeService";

const dashboard = new Dashboard({});

const startTradingBot = async (coin, providers) => {
  const db = await new Store(config.HOST_MONGO, config.DB_NAME).openDb();
  const co = await new CoinCollection(db).getCollection();
  const hc = await new OrderCollection(db).getCollection();
  const coinService = new CoinService(co);
  const orderService = new OrderService(hc, 6);
  const tradeService = new TradeService(providers, coinService, orderService, dashboard, 60);

  tradeService.startMonitor().catch(e => dashboard.logText.log(e));
};

const providers = [
  new BitstampProvider(request, 'LTC', 'eur', 1),
  // new BittrexProvider(request, 'LTC', 'USDT', 1)
];
startTradingBot('LTC', providers).catch(e => console.log('error', e));


