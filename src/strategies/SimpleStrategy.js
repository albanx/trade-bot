import OrderService from "../services/OrderService";

export default class SimpleStrategy {
  constructor({lowThreshold, highThreshold, frequency, orders}) {
    this.lowThreshold = lowThreshold;
    this.highThreshold = highThreshold;
    this.frequency = frequency;
    this.orders = orders;
  }

  static get NAME() {
    return 'simple'
  }

  getNextOrderType(coinExchangeModel, lastOrder, preview) {
    this.updatePriceChanges(coinExchangeModel);
    const nextOrderBasedOnMarket = preview ? 
      this.getPreviewOrderType(coinExchangeModel) : this.getOrderTypeBasedOnPrice(coinExchangeModel);
    const nextOrderBasedOnLast =  this.getOrderTypeBasedOnLastOrder(lastOrder);

    return nextOrderBasedOnLast ? nextOrderBasedOnLast : nextOrderBasedOnMarket;
  }

  getPriceNextOrder(coinExchangeModel, nextOrderType) {
    const priceOrder = coinExchangeModel.getPriceOrder();
    if (nextOrderType === OrderService.ORDER_SELL) {
      return priceOrder + priceOrder * this.highThreshold / 100;
    }

    if (nextOrderType === OrderService.ORDER_BUY) {
      return priceOrder - priceOrder * this.lowThreshold / 100;
    }

    return null;
  }

  updatePriceChanges(coinExchangeModel) {
    const priceExchange = coinExchangeModel.getPriceExchange();
    const priceOrder = coinExchangeModel.getPriceOrder();
    const percent = (priceExchange - priceOrder) * 100 / Math.max(priceOrder, priceExchange);
    coinExchangeModel.setPriceChange(percent);
  }

  getPreviewOrderType(coinExchangeModel) {
    const percentChange = coinExchangeModel.getPriceChange();
    return percentChange > 0 ? OrderService.ORDER_SELL : OrderService.ORDER_BUY;
  }

  getOrderTypeBasedOnPrice(coinExchangeModel) {
    const percentChange = coinExchangeModel.getPriceChange();
    if (percentChange <= this.lowThreshold) {
      appLog(`getOrderTypeBasedOnPrice::lowThreshold::${percentChange} - ${this.lowThreshold}`);
      return  OrderService.ORDER_BUY;
    }

    if (percentChange >= this.highThreshold) {
      appLog(`getOrderTypeBasedOnPrice::highThreshold::${percentChange} - ${this.highThreshold}`);
      return OrderService.ORDER_SELL;
    }

    return null;
  }

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
