export default class AbstractStrategy {
  getOrderTypeBasedOnLastOrder(lastOrder) {
    if (lastOrder) {
      const orderType = lastOrder.getOrderType();
      if (orderType === OrderService.ORDER_BUY) {
        return OrderService.ORDER_SELL;
      }

      if (orderType === OrderService.ORDER_SELL) {
        return OrderService.ORDER_BUY;
      }
    }

    return null;
  }
}