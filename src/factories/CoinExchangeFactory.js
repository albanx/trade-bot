import CoinExchangeModel from "../models/CoinExchangeModel";

const createCoinExchange = ({_id, coin, exchange, baseCoin, amount, priceExchange, priceOrder, priceStart, priceChange, lastUpdate, strategy}) =>
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
      priceChange,
      lastUpdate,
      strategy
    }
  );

export default createCoinExchange;
