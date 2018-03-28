import createCoinExchange from "../../src/factories/CoinExchangeFactory";

const coinExchangeModel = createCoinExchange({
  _id: 1,
  coin: 'LTC',
  exchange: 'bitstamp',
  baseCoin: 'eur',
  amount: 1,
  priceExchange: 100,
  priceOrder: 120,
  priceStart: 125,
  priceChange: 2,
  lastUpdate: new Date()
});


export default coinExchangeModel;
