import CoinExchangeModel from "../models/CoinExchangeModel";
import {initFloat} from '../Utils';

const createCoinExchange = ({
  _id, 
  coin, 
  exchange, 
  baseCoin, 
  amount, 
  priceExchange, 
  priceOrder, 
  priceStart, 
  priceChange, 
  lastOrderType, 
  lastUpdate, 
  strategy, 
  tradeMode
}) =>
  new CoinExchangeModel(
    {
      _id,
      coin,
      exchange,
      baseCoin,
      amount: initFloat(amount),
      priceExchange: initFloat(priceExchange),
      priceOrder: initFloat(priceOrder),
      priceStart: initFloat(priceStart),
      priceChange: {diff: 0, percent: 0},
      lastOrderType,
      lastUpdate,
      strategy,
      tradeMode
    }
  );

export default createCoinExchange;
