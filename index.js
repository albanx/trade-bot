import request from 'request-promise-native';
import mongo from 'mongodb';
import Kraken from './providers/kraken';
import config from './config';
import BitTrex from './providers/bittrex';

const krakenApi = new Kraken('', '', {});
const MARKETS = [];

const openDB = async () => {
  const client = await mongo.MongoClient.connect(config.HOST_MONGO);
  return client.db(config.DB_NAME);
};

const getHistoryCollectin = async db => {
  const collection = await db.collection(config.COLLECTION_HISTORY);
  return collection;
};

const getPriceCollection = async db => {
  const collection = await db.collection(config.COLLECTION_COIN);
  collection.createIndex({ name: 1, market: 1 }, { unique: true });
  return collection;
};

const checkCoinPrice = async (collection, name, market) => {
  const coin = await collection.findOne({ name, market });
  return coin;
};

const getStartPrice = async (collection, name, market) => {
  const coin = await collection.findOne({ name, market });
  return coin.price_start;
};

const updateCoinPrice = async (
  collection,
  coin,
  priceMarket,
  priceStart,
  market,
  action
) => {
  collection.update(
    {
      name: coin,
      market: market
    },
    {
      name: coin,
      market: market,
      price_current: priceMarket,
      price_start: priceStart,
      action: action,
      time: new Date()
    },
    {
      upsert: true
    }
  );
  console.log('updateCoinPrice::done');
};

const addToHistory = (coll, coin, price, market, action) => {
  coll.insert({ coin, price, market, action, time: new Date() });
};

const getPriceBittrex = async coinCode => {
  const bt = new BitTrex(request);
  const price = await bt.getPrice(coinCode);
  console.log('Price coins: ', price);
};

const sellOnBittrex = async coinName => {
  console.log('sellOnBittrex::', coinName);
};

const buyOnBittrex = async coinName => {
  console.log('buyOnBittrex::', coinName);
};

const findNextAction = async (historyC, coin, market, percentChange) => {
  const last = await historyC.findOne(
    { coin, market },
    { sort: { _id: -1 }, limit: 1 }
  );
  if (Math.abs(percentChange) > 10) {
    let nextActionBasedOnMarket = percentChange > 0 ? 'sell' : 'buy';

    if (
      (last.action === 'buy' && nextActionBasedOnMarket === 'sell') ||
      (last.action === 'sell' && nextActionBasedOnMarket === 'buy') ||
      !last.action
    ) {
      return nextActionBasedOnMarket;
    }
  }
  return 'noaction';
};

const startTradingBot = async (coinName, market) => {
  console.log('startTradingBot::');
  const db = await openDB();
  const collection = await getPriceCollection(db);
  const historyColl = await getHistoryCollectin(db);
  let priceStart = await getStartPrice(collection, coinName, market);
  const priceMarket = await getPriceBittrex(coinName);

  if (!priceStart) priceStart = priceMarket;

  setInterval(async () => {
    console.log('checkingInterval::');
    const percentChange = (priceMarket - priceStart) * 100 / priceMarket;
    const nextAction = await findNextAction(
      historyColl,
      coinName,
      market,
      percentChange
    );

    if (nextAction === 'sell') {
      const response = await sellOnBittrex(coinName);
      if (response.success) {
        sellOnBittrex(coinName);
        updateCoinPrice(collection, coinName, priceMarket, market);
        addToHistory(historyColl, coinName, price, market, nextAction);
      }
    } else if (nextAction === 'buy') {
      const response = await buyOnBittrex(coinName);
      if (response.success) {
        updateCoinPrice(collection, coinName, priceMarket, market);
        addToHistory(historyColl, coinName, price, market, nextAction);
      }
    }
  }, 30000);
};


startTradingBot('LTC', 'bittrex').catch(e => console.log('error', e));