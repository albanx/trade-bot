import CoinExchangeModel from "../models/CoinExchangeModel";

const createCoinExchange = ({_id, coin, exchange, baseCoin, amount, priceExchange, priceOrder, priceStart, lastUpdate}) =>
  new CoinExchangeModel(
    {
      _id,
      coin,
      exchange,
      baseCoin,
      amount,
      priceExchange,
      priceOrder,
      priceStart,
      lastUpdate
    }
  );

export default createCoinExchange;
