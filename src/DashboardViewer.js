import SimpleStrategy from "./strategies/SimpleStrategy";
import { formatDate } from './Utils';

export default class DashboardViewer {
  constructor(dashboard, orderService) {
    this.dashboard = dashboard;
    this.orderService = orderService;
  }

  showCoins(coins) {
    this.dashboard.setPriceMonitorLabel(`Price Monitor - ${new Date()}`);
    this.dashboard.addPriceMonitorRows(
      coins.map(c => {
        const nextOrderType = this.orderService.getOrderType(c, true);          
        const priceNextOrder = this.orderService.getPreviewPriceNextOrder(c, nextOrderType);
        const nextText = `${nextOrderType}@${priceNextOrder.toFixed(2)}`;
        return [
          c.getId().toString().substring(0, 4),
          `${c.coin}@${c.exchange}`,
          `${c.priceExchange.toFixed(4)} / ${(c.priceExchange * c.amount).toFixed(4)}`,
          `${c.priceOrder.toFixed(4)} / ${(c.priceOrder * c.amount).toFixed(4)}`,
          `${c.priceChange.diff.toFixed(4)} / ${(c.priceChange.diff * c.amount).toFixed(4)} €`,
          c.priceChange.percent.toFixed(4) + ' %',
          c.tradeMode,
          nextText,
          c.strategy.name
        ]
      })
    );
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