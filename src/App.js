import request from 'request-promise-native';
import config from './config';
import Store from './Store';
import CoinService from './services/CoinPriceService';
import CoinCollection from './collections/CoinPriceCollection';
import OrderCollection from './collections/OrderCollection';
import BittrexProvider from './providers/BittrexProvider';
import OrderService from './services/OrderService';
import BitstampProvider from "./providers/BitstampProvider";
import Dashboard from './Dashboard';
import TradeService from "./services/TradeService";
import createCoin from "./factories/CoinFactory";
import createCoinPrice from "./factories/CoinPriceFactory";

const dashboard = new Dashboard({});

const startTradingBot = async (providers) => {
  const db = await new Store(config.HOST_MONGO, config.DB_NAME).openDb();
  const co = await new CoinCollection(db).getCollection();
  const hc = await new OrderCollection(db).getCollection();
  const coinService = new CoinService(co);
  const orderService = new OrderService(hc, 6);
  const tradeService = new TradeService(providers, coinService, orderService, dashboard, 60);

  tradeService.startMonitor().catch(e => dashboard.logText.log(e));
};


const liteCoin = createCoin({code: 'LTC', name: 'litecoin', supply: 0});
const euroCoin = createCoin({code: 'EUR', name: 'euro', supply: 0});
const provider = new BitstampProvider(request, 1);

const providers = [
  provider,
  // new BittrexProvider(request, 'LTC', 'USDT', 1)
];
startTradingBot(providers).catch(e => console.log('error', e));


