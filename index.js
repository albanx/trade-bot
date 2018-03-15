import request from 'request-promise-native';
import mongo from 'mongodb';
import config from './config';
import Store from './src/Store';
import CoinService from './src/CoinService';
import CoinCollection from './src/CoinCollection';
import HistoryCollection from './src/HistoryCollection';
import BittrexProvider from './src/providers/BittrexProvider';
import HistoryService from './src/HistoryService';

const startTradingBot = async (coinName, market) => {
  console.log('startTradingBot::');
  const db = await new Store(config.HOST_MONGO, config.DB_NAME).openDb();
  const co = await new CoinCollection(db).getCollection();
  const hc = await new HistoryCollection(db).getCollection();
  const coinService = new CoinService(co);
  const historyService = new HistoryService(hc, 0.002);
  const provider = new BittrexProvider(request, 'USDT');

  let priceStart = await coinService.getPriceStart(coinName, market);
  let priceMarket = await provider.getCoinPrice(coinName);

  console.log('priceStart::', priceStart);
  if (!priceStart) {
    priceStart = priceMarket;
    await coinService.updatePrice(coinName, priceStart, priceStart, market, null);
  }

  console.log(`Start conditions: start price ${priceStart}, price market ${priceMarket}`);

  const startMonitor = async () => {
    priceMarket = await provider.getCoinPrice(coinName);
    const percentChange = (priceMarket - priceStart) * 100 / priceMarket;
    const nextAction = await historyService.findNextAction(
      coinName,
      market,
      percentChange
    );

    console.log(`Monitor start price${priceStart}, price market ${priceMarket}, ${percentChange} %, action ${nextAction}`);

    if (nextAction) {
      let response = {};
      if (nextAction === 'sell') {
        response = await provider.sellCoin(coinName);
      } else if (nextAction === 'buy') {
        response = await provider.buyCoin(coinName);
      }

      if (response.success) {
        coinService.updatePrice(coinName, priceStart, priceMarket, market, nextAction);
        historyService.addToHistory(coinName, price, market, nextAction);
      }
    }

    setTimeout(startMonitor, 5000);
  };

  startMonitor();
};


startTradingBot('LTC', 'bittrex').catch(e => console.log('error', e));
