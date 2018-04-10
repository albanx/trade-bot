import OrderService from '../services/OrderService';
import AbstractStrategy from './AbstractStrategy';

export default class DiffBasedStrategy extends AbstractStrategy {
  constructor({ baseCoinDiff, orders }) {
    super();
    this.baseCoinDiff = baseCoinDiff;
    this.orders = orders;
  }

  static get NAME() {
    return 'difference';
  }

  getNextOrderType(coinExchangeModel, lastOrder, preview) {
    this.updatePriceChanges(coinExchangeModel);
    const nextOrderBasedOnMarket = preview
      ? this.getPreviewOrderType(coinExchangeModel)
      : this.getOrderTypeBasedOnPrice(coinExchangeModel);
    const nextOrderBasedOnLast = this.getOrderTypeBasedOnLastOrder(lastOrder);

    return nextOrderBasedOnLast ? nextOrderBasedOnLast : nextOrderBasedOnMarket;
  }

  //privates
  getPriceNextOrder(coinExchangeModel, nextOrderType) {
    const priceOrder = coinExchangeModel.getPriceOrder();
    if (nextOrderType === OrderService.ORDER_SELL) {
      return priceOrder + this.baseCoinDiff;
    }

    if (nextOrderType === OrderService.ORDER_BUY) {
      return priceOrder - this.baseCoinDiff;
    }

    return null;
  }

  updatePriceChanges(coinExchangeModel) {
    const priceExchange = coinExchangeModel.getPriceExchange();
    const priceOrder = coinExchangeModel.getPriceOrder();
    const diff = priceExchange - priceOrder;
    coinExchangeModel.setPriceChange(diff);
  }

  getPreviewOrderType(coinExchangeModel) {
    const diff = coinExchangeModel.getPriceChange();
    return diff > 0 ? OrderService.ORDER_SELL : OrderService.ORDER_BUY;
  }

  getOrderTypeBasedOnPrice(coinExchangeModel) {
    const diff = coinExchangeModel.getPriceChange();
    if (diff <= -this.baseCoinDiff) {
      return OrderService.ORDER_BUY;
    }

    if (diff >= this.baseCoinDiff) {
      return OrderService.ORDER_SELL;
    }

    return null;
  }
}
