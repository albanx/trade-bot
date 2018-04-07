import createExchange from "../factories/ExchangeFactory";
import OrderService from "./OrderService";
import EVENTS from "../Events";

export default class TradeMonitorService {
  constructor(coinExchangeService, orderService, emitter, coinsToTradeDefault = []) {
    this.coinExchangeService = coinExchangeService;
    this.orderService = orderService;
    this.refreshInterval = 30000;
    this.exchanges = {};
    this.coinsToTrade = [];
    this.coinsToTradeDefault = coinsToTradeDefault;
    this.emitter = emitter;
  }

  emit(event, ...params) {
    this.emitter.emit(event, ...params);
  }

  async start() {
    this.emit(EVENTS.MONITOR_START);
    await this.loadCoins();
    await this.initializeCoins();
    await this.startMonitor();
  }

  async loadCoins() {
    this.emit(EVENTS.MONITOR_LOAD_COINS);
    this.coinsToTrade = await this.coinExchangeService.getCoinsToTrade();
    if (this.coinsToTrade.length === 0) {
      this.coinsToTrade = [...this.coinsToTradeDefault];
    }
  }

  async initializeCoins() {
    this.emit(EVENTS.MONITOR_INIT_COINS);
    for (let i = 0; i < this.coinsToTrade.length; i++) {
      const coin = this.coinsToTrade[i];
      await this.initializeCoinPrice(coin);
    }
  }

  async initializeCoinPrice(coin) {
    await this.updateExchangePrice(coin);
    const priceExchange = coin.getPriceExchange();

    if (!coin.getPriceOrder()) coin.setPriceOrder(priceExchange);
    if (!coin.getPriceStart()) coin.setPriceStart(priceExchange);
    if (!coin.getPriceExchange()) coin.setPriceExchange(priceExchange);
    if (!coin.getAmount()) coin.setAmount(1);
    if (!coin.getPriceChange()) coin.setPriceChange(0);
  }

  async updateExchangePrice(coinExchangeModel) {
    const coin = coinExchangeModel.getCoin();
    const exchange = coinExchangeModel.getExchange();
    const baseCoin = coinExchangeModel.getBaseCoin();
    const exchangeAdapter = this.getExchangeAdapter(exchange);
    const priceExchange = await exchangeAdapter.getCoinPrice(coin, baseCoin);
    coinExchangeModel.setPriceExchange(priceExchange);
  }

  async startMonitor() {
    this.emit(EVENTS.MONITOR_CYCLE, this.coinsToTrade);
    await Promise.all(this.coinsToTrade.map(c => this.checkCoin(c)));
    setTimeout(() => this.startMonitor(), this.refreshInterval);
  }

  async checkCoin(coinExchangeModel) {
    this.emit(EVENTS.MONITOR_CHECK_COIN, coinExchangeModel);
    await this.updateExchangePrice(coinExchangeModel);
    const orderType = await this.orderService.getOrderType(coinExchangeModel);
    
    if (orderType) {
      this.emit(EVENTS.MONITOR_MAKE_ORDER, coinExchangeModel, orderType);
      // await this.makeOrder(coinExchangeModel, orderType);
    }
    await this.coinExchangeService.saveCoinExchange(coinExchangeModel);
  }

  async makeOrder(coinExchangeModel, orderType) {
    this.emit(EVENTS.MONITOR_MAKE_ORDER, coinExchangeModel, orderType);
    const response = await this.createExchangeOrder(coinExchangeModel, orderType);
    if (response.success) {
      coinExchangeModel.setPriceOrder(coinExchangeModel.getPriceChanges());
      await this.orderService.saveOrder(coinExchangeModel, response.orderId, orderType);
      this.emit(EVENTS.MONITOR_ORDER_DONE, coinExchangeModel, orderType);
    } else {
      this.emit(EVENTS.MONITOR_ORDER_ERROR, response.error, orderType);
    }
  }

  async createExchangeOrder(coinExchangeModel, orderType) {
    const exchange = coinExchangeModel.getExchange();
    const exchangeAdapter = this.getExchangeAdapter(exchange);
    return await exchangeAdapter.makeOrder(coinExchangeModel, orderType);
  }

  getExchangeAdapter(name) {
    if (!this.exchanges[name]) {
      this.exchanges[name] = createExchange(name);
    }

    return this.exchanges[name];
  }
}
