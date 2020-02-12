import SimpleStrategy from './strategies/SimpleStrategy';
import { formatDate } from './Utils';

export default class DashboardViewer {
  constructor(dashboard, orderService) {
    this.dashboard = dashboard;
    this.orderService = orderService;
  }

  showCoins(coins) {
    this.dashboard.setPriceMonitorLabel(`Price Monitor - ${new Date()}`);
    this.dashboard.addPriceMonitorRows(coins.map(c => this.mapCoinToViewer(c)));
  }

  mapCoinToViewer(coin) {
    const nextOrderType = this.orderService.getOrderType(coin, true);
    const priceNextOrder = this.orderService.getPreviewPriceNextOrder(
      coin,
      nextOrderType
    );
    const nextText = `${nextOrderType}@${priceNextOrder.toFixed(2)}`;
    const id = coin
      .getId()
      .toString()
      .substring(0, 4);

    return [
      id,
      `${coin.coin}@${coin.exchange}`,
      `${coin.priceExchange.toFixed(4)} / ${(
        coin.priceExchange * coin.amount
      ).toFixed(4)}`,
      `${coin.priceOrder.toFixed(4)} / ${(
        coin.priceOrder * coin.amount
      ).toFixed(4)}`,
      `${coin.priceChange.diff.toFixed(4)} / ${(
        coin.priceChange.diff * coin.amount
      ).toFixed(4)} €`,
      coin.priceChange.percent.toFixed(4) + ' %',
      coin.tradeMode,
      nextText,
      coin.strategy.name
    ];
  }

  showCurrentOrders(orders) {
    this.dashboard.addRowOrders(
      orders.map(o => [
        o.coin,
        o.exchange,
        o.exchangeOrderId,
        o.status,
        `${o.priceOrder.toString()} / ${o.value ? o.value : '-'}`,
        o.orderType,
        o.dateCreated ? formatDate(o.dateCreated) : ''
      ])
    );
  }
}
