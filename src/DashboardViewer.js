export default class DashboardViewer {
  constructor(dashboard, orderService) {
    this.dashboard = dashboard;
    this.orderService = orderService;
  }

  showCoins(coins) {
    this.dashboard.setPriceMonitorLabel(`Price Monitor - ${new Date()}`);
    this.dashboard.addPriceMonitorRows(
      coins.map(c => [
        c
          .getId()
          .toString()
          .substring(0, 4),
        c.getCoin(),
        c.getExchange(),
        c.getPriceStart().toString(),
        c.getPriceExchange().toFixed(4).toString(),
        c.getPriceOrder().toString(),
        c.getPriceChange().toFixed(2)
      ])
    );
  }

  showCurrentOrders(orders) {
    this.dashboard.addRowOrders(
      orders.map(o => [
        o.getCoin(),
        o.getExchange(),
        o.getExchangeOrderId(),
        o.getStatus(),
        o.getPriceOrder(),
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
            c.getCoin(),
            c.getExchange(),
            nextText,
            c.getAmount()
          ];
        })
      )
    );
  }
}