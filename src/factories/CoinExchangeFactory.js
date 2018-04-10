import CoinExchangeModel from "../models/CoinExchangeModel";

const createCoinExchange = ({_id, coin, exchange, baseCoin, amount, priceExchange, priceOrder, priceStart, priceChange, lastUpdate, strategy, tradeMode}) =>
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
      strategy,
      tradeMode
    }
  );

export default createCoinExchange;
