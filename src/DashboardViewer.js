import SimpleStrategy from "./strategies/SimpleStrategy";

export default class DashboardViewer {
  constructor(dashboard, orderService) {
    this.dashboard = dashboard;
    this.orderService = orderService;
  }

  showCoins(coins) {
    this.dashboard.setPriceMonitorLabel(`Price Monitor - ${new Date()}`);
    this.dashboard.addPriceMonitorRows(
      coins.map(c => {
        return [
        c.getId().toString().substring(0, 4),
        `${c.coin}@${c.exchange}`,
        c.priceStart.toString(),
        c.priceExchange.toFixed(4).toString(),
        c.priceOrder.toString(),
        c.priceChange.diff.toFixed(4) + ' €',
        c.priceChange.percent.toFixed(4) + ' %',
        c.tradeMode
      ]
    })
    );
  }

  showCurrentOrders(orders) {
    this.dashboard.addRowOrders(
      orders.map(o => [
        o.getCoin(),
        o.getExchange(),
        o.getExchangeOrderId(),
        o.getStatus(),
        o.getPriceOrder().toString(),
        o.getOrderType()
      ])
    );
  }

 async showNextOrders(coins) {
    this.dashboard.addRowNextAction(
      await Promise.all(
        coins.map(async c => {
          const nextOrderType = await this.orderService.getOrderType(c, true);          
          const priceNextOrder = this.orderService.getPreviewPriceNextOrder(c, nextOrderType);
          const nextText = `${nextOrderType}@${priceNextOrder.toFixed(2)}`;

          return [
            c
              .getId()
              .toString()
              .substring(0, 4),
            c.coin,
            c.exchange,
            nextText,
            c.amount
          ];
        })
      )
    );
  }
}