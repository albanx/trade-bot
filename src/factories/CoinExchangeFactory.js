import CoinExchangeModel from "../models/CoinExchangeModel";

const createCoinExchange = ({_id, coin, exchange, baseCoin, amount, priceExchange, priceOrder, priceStart, priceChange, lastUpdate}) =>
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
      lastUpdate
    }
  );

export default createCoinExchange;
