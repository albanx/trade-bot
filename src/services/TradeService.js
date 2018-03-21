import OrderService from "./OrderService";

export default class TradeService {
  constructor(providers, coinService, orderService, display, refreshInterval) {
    this.providers = providers;
    this.coinService = coinService;
    this.orderService = orderService;
    this.displayService = display;
    this.refreshInterval = refreshInterval * 1000;

    this.providers.map(async p => await this.initCoinPrice(p));

  }

  async initCoinPrice(provider) {
    const providerName = provider.getName();
    const coin = provider.getCoin();
    const priceMarket = await provider.getCoinPrice();
    await this.coinService.initCoinPrice(coin, providerName, priceMarket);
  }

  async startMonitor() {
    const rows = [];
    for( let i = 0; i < this.providers.length; i++) {
      const row = await this.priceMonitor(this.providers[i]);
      rows.push(row);
    }

    this.displayService.addPriceMonitorRows(rows);
    this.displayService.setPriceMonitorLabel(`Price Monitor - ${new Date()}`);
    await this.displayCurrentOrders();
    setTimeout(() => this.startMonitor(), this.refreshInterval);
  }



  async priceMonitor(provider) {
    const market = provider.getName();
    const coin = provider.getCoin();
    const coinRow = await this.coinService.getCoin(coin, market);
    const priceAction = parseFloat(coinRow.priceAction);
    const priceStart = parseFloat(coinRow.priceStart);
    const priceMarket = await provider.getCoinPrice();

    const percentChange = (priceMarket - priceAction) * 100 / priceMarket;
    const action = await this.orderService.findNextOrderType(coin, market, percentChange);
    const orderId = await this.orderService.makeOrder(provider, priceMarket, action);

    //log action in history table
    if (orderId) {
      await this.coinService.updatePrice(coin, market, priceMarket, priceStart, priceMarket, action);
      this.orderService.addToHistory({
        coin,
        baseCoin: provider.getBaseCoin(),
        priceStart,
        priceAction,
        market,
        orderId,
        action,
        status: 'open'
      });
    }

    return [
      coin,
      market,
      priceStart.toPrecision(4),
      priceMarket.toPrecision(4),
      priceAction.toPrecision(4),
      percentChange.toPrecision(4) + ' %',
      action
    ];
  }

  async displayCurrentOrders() {
    const nextActionRows = [];
    const orderRows = [];
    const orders = await this.orderService.getOrders('open');
    //current orders
    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      orderRows.push([
        order.coin,
        order.market,
        order.orderId,
        order.status,
        order.priceAction,
        order.action
      ]);
      const nextAction = this.orderService.getNextOrderType(order.action);
      const priceNextAction = this.orderService.getPriceNextAction(order.priceAction, nextAction);
      const nextText = `${nextAction}@${priceNextAction}`;
      nextActionRows.push([order.orderId, order.coin, order.market, nextText]);
    }

    this.displayService.addRowOrders(orderRows);
    this.displayService.addRowNextAction(nextActionRows);
  }
}
