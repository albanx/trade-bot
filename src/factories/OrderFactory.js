import OrderModel from '../models/OrderModel';

const createOrder = ({coinExchangeId, exchangeOrderId, coin, baseCoin, exchange, priceOrder, orderType, status, dateCreated}) =>
  new OrderModel({coinExchangeId, exchangeOrderId, coin, baseCoin, exchange, priceOrder, orderType, status, dateCreated});

export default createOrder;
