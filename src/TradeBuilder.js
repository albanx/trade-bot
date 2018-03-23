import createCoinPrice from "./factories/CoinPriceFactory";
import createProvider from "./factories/ProviderFactory";
import ProviderInterface from "./providers/ProviderInterface";

export default class TradeBuilder {
  constructor(coinService, orderService) {
    this.coinService = coinService;
    this.orderService = orderService;
    this.refreshInterval = 30000;
    this.providers = {};
  }

  async build() {
    const coinPrices = await this.loadCoinPricesFromDb();
    this.coinPricesModels = coinPrices.map(cp => createCoinPrice(cp));
  }

  async loadCoinPricesFromDb() {
    const coinPrices = await this.coinService.getCoinPrices();
    return coinPrices;
  }

  /**
   *
   * @param providerName
   * @returns {ProviderInterface}
   */
  getProviderModel(providerName){
    if(!this.providers[providerName]) {
      this.providers[providerName] = createProvider(providerName);
    }

    return this.providers[providerName];
  }

  async startMonitor() {
    const rows = [];
    for( let i = 0; i < this.coinPricesModels.length; i++) {
      const row = await this.priceMonitor(this.coinPricesModels[i]);
    }

    setTimeout(() => this.startMonitor(), this.refreshInterval);
  }

  async priceMonitor(coinPriceModel) {
    const market = coinPriceModel.getProvider();
    const coin = coinPriceModel.getCoin();
    const baseCoin = coinPriceModel.getBaseCoin();
    const priceAction = coinPriceModel.getPriceOrder();
    const priceStart = coinPriceModel.getPriceStart();

    const provider = this.getProviderModel(market);
    const priceMarket = await provider.getCoinPrice(coin, baseCoin);

    const percentChange = (priceMarket - priceAction) * 100 / priceMarket;


    //
    const action = await this.orderService.findNextOrderType(coin, market, percentChange);
    const orderId = await this.orderService.makeOrder(provider, priceMarket, action);

    //log action in history table
    if (orderId) {
      coinPriceModel.setPriceOrder(priceMarket);
      await this.coinService.savePriceModel(coinPriceModel);
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

}
