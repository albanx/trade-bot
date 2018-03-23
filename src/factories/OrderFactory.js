import OrderModel from '../models/OrderModel';

const createOrder = ({providerOrderId, provider, coin, baseCoin, priceOrder, orderType, status}) =>
  new OrderModel(
    providerOrderId,
    provider,
    coin,
    baseCoin,
    priceOrder,
    orderType,
    status,
    new Date()
  );

export default createOrder;
