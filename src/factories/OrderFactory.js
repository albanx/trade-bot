import OrderModel from '../models/OrderModel';

const createOrder = ({_id, coinExchangeId, exchangeOrderId, coin, baseCoin, exchange, priceOrder, orderType, status, dateCreated}) =>
  new OrderModel({
    _id,
    coinExchangeId,
    exchangeOrderId,
    coin,
    baseCoin,
    exchange,
    priceOrder,
    orderType,
    status,
    dateCreated
  });

export default createOrder;
