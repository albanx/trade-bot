import OrderModel from '../models/OrderModel';
import createProvider from "./ProviderFactory";
import createCoin from "./CoinFactory";

const createOrder = ({id, provider, coin, baseCoin, price, status, type}) =>
  new OrderModel(
    id,
    createProvider(provider),
    createCoin(coin),
    createCoin(baseCoin),
    status,
    price,
    type
  );

export default createOrder;
