import CoinPriceModel from "../models/CoinPriceModel";

const createCoinPrice = ({coin, provider, priceProvider, priceOrder, priceStart, lastUpdate}) =>
  new CoinPriceModel(
    coin,
    provider,
    priceProvider,
    priceOrder,
    priceStart,
    lastUpdate
  );

export default createCoinPrice;
