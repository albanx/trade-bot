import OrderService from '../services/OrderService';

export default class AbstractStrategy {
  getNextOrderType(coinExchangeModel, preview) {
    const nextOrderBasedOnMarketPrice = this.getOrderTypeBasedOnPrice(coinExchangeModel);
    const nextOrderBasedOnLast = this.getOrderTypeBasedOnLastOrder(coinExchangeModel.lastOrderType);
    let nextOrderType = null;

    if (nextOrderBasedOnLast) {
      nextOrderType = nextOrderBasedOnLast;
    } else if (nextOrderBasedOnMarketPrice) {
      nextOrderType = nextOrderBasedOnMarketPrice;
    }

    if (preview || this.isOrderPossible(coinExchangeModel, nextOrderType)) {
      return nextOrderType;
    }

    return null;
  }

  getOrderTypeBasedOnLastOrder(orderType) {
    if (orderType) {
      if (orderType === OrderService.ORDER_BUY) {
        return OrderService.ORDER_SELL;
      }

      if (orderType === OrderService.ORDER_SELL) {
        return OrderService.ORDER_BUY;
      }
    }

    return null;
  }

  getOrderTypeBasedOnPrice(coinExchangeModel) {
    const change = coinExchangeModel.priceChange.diff;
    return change > 0 ? OrderService.ORDER_SELL : OrderService.ORDER_BUY;
  }
}