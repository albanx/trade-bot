import createExchange from "../factories/ExchangeFactory";
import OrderService from "./OrderService";
import EVENTS from "../Events";
import { AppRequestException } from "../Exceptions";

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

  static get TRADE_MODE_LIVE() {
    return 'live';
  }

  static get TRADE_MODE_SIMULATION() {
    return 'simulation';
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
    const storedCoins = await this.coinExchangeService.getCoinsToTrade();
    const newCoins = this.coinsToTradeDefault.filter(item => !storedCoins.find(item2 => 
          ( item.getCoin() === item2.getCoin() &&
          item.getExchange() === item2.getExchange() &&
          item.getBaseCoin() === item2.getBaseCoin() && 
          item.getTradeMode() === item2.getTradeMode() && 
          item.getStrategy().name === item2.getStrategy().name )
        )
    );

    this.coinsToTrade = storedCoins.concat(newCoins);
  }

  async initializeCoins() {
    this.emit(EVENTS.MONITOR_INIT_COINS);
    return Promise.all(this.coinsToTrade.map(item => this.initializeCoinPrice(item)));
  }

  async initializeCoinPrice(coin) {
    await this.updateExchangePrice(coin);
    const priceExchange = coin.getPriceExchange();

    if (!coin.getTradeMode()) coin.setTradeMode(TradeMonitorService.TRADE_MODE_SIMULATION);
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
    await Promise.all(this.coinsToTrade.map(c => this.checkCoin(c))).catch( e => {
      appWarning(e.message, e);
    });
    setTimeout(() => this.startMonitor(), this.refreshInterval);
  }

  async checkCoin(coinExchangeModel) {
    this.emit(EVENTS.MONITOR_CHECK_COIN, coinExchangeModel);
    await this.updateExchangePrice(coinExchangeModel);
    const orderType = await this.orderService.getOrderType(coinExchangeModel);
    
    if (orderType) {
      await this.makeOrder(coinExchangeModel, orderType);
    }
    await this.coinExchangeService.saveCoinExchange(coinExchangeModel);
  }

  async makeOrder(coinExchangeModel, orderType) {
    this.emit(EVENTS.MONITOR_MAKE_ORDER, coinExchangeModel, orderType);
    const response = await this.createExchangeOrder(coinExchangeModel, orderType);
    if (response.success) {
      coinExchangeModel.setPriceOrder(coinExchangeModel.getPriceExchange());
      await this.orderService.saveOrder(coinExchangeModel, response.orderId, orderType);
      this.emit(EVENTS.MONITOR_ORDER_DONE, coinExchangeModel, orderType);
    } else {
      this.emit(EVENTS.MONITOR_ORDER_ERROR, response.error, orderType);
    }
  }

  async createExchangeOrder(coinExchangeModel, orderType) {
    if (coinExchangeModel.getTradeMode() === TradeMonitorService.TRADE_MODE_LIVE) {
      const exchange = coinExchangeModel.getExchange();
      const exchangeAdapter = this.getExchangeAdapter(exchange);
      return await exchangeAdapter.makeOrder(coinExchangeModel, orderType);
    }

    return await this.makeSimulatedOrder(coinExchangeModel, orderType);
  }

  async makeSimulatedOrder(coinExchangeModel, orderType) {
    return Promise.resolve({
      success: true,
      orderId: `${Math.random().toString(36).substr(2, 5)}_simulated`,
      type: orderType,
      price: coinExchangeModel.getPriceExchange(),
      amount: coinExchangeModel.getAmount(),
      error: ''
    });
  }

  getExchangeAdapter(name) {
    if (!this.exchanges[name]) {
      this.exchanges[name] = createExchange(name);
    }

    return this.exchanges[name];
  }
}
