import createExchange from '../factories/ExchangeFactory';
import OrderService from './OrderService';
import EVENTS from '../Events';
import { AppRequestException } from '../Exceptions';

export default class TradeMonitorService {
  constructor(
    coinExchangeService,
    orderService,
    emitter,
    coinsToTradeDefault = []
  ) {
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

  static get TRADE_MODE_MONITOR() {
    return 'monitor';
  }

  emit(event, ...params) {
    this.emitter.emit(event, ...params);
  }

  async start() {
    this.emit(EVENTS.MONITOR_START);
    await this.loadCoins();
    await this.startMonitor();
  }

  async loadCoins() {
    const storedCoins = await this.coinExchangeService.getCoinsToTrade();
    const newCoins = this.coinsToTradeDefault.filter(
      item =>
        !storedCoins.find(
          item2 =>
            item.coin === item2.coin &&
            item.exchange === item2.exchange &&
            item.baseCoin === item2.baseCoin &&
            item.tradeMode === item2.tradeMode &&
            item.strategy.name === item2.strategy.name
        )
    );

    this.coinsToTrade = storedCoins.concat(this.coinsToTradeDefault);
    this.coinsToTrade.forEach(coin => this.initCoin(coin, 0));
    this.emit(EVENTS.MONITOR_LOAD_COINS);
  }

  async startMonitor() {
    await Promise.all(this.coinsToTrade.map(c => this.checkCoin(c))).catch(
      e => {
        appWarning(e.message, e);
      }
    );
    this.emit(EVENTS.MONITOR_CYCLE, this.coinsToTrade);
    setTimeout(() => this.startMonitor(), this.refreshInterval);
  }

  async checkCoin(coinExchangeModel) {
    await this.updateCoinPrice(coinExchangeModel);
    const orderType = this.orderService.getOrderType(coinExchangeModel);

    if (
      orderType &&
      coinExchangeModel.tradeMode !== TradeMonitorService.TRADE_MODE_MONITOR
    ) {
      await this.startOrder(coinExchangeModel, orderType);
    }

    await this.coinExchangeService.saveCoinExchange(coinExchangeModel);
    this.emit(EVENTS.MONITOR_CHECK_COIN, coinExchangeModel);
  }

  initCoin(coin, priceExchange) {
    if (!coin.tradeMode)
      coin.tradeMode = TradeMonitorService.TRADE_MODE_SIMULATION;
    if (!coin.priceOrder) coin.priceOrder = priceExchange;
    if (!coin.priceStart) coin.priceStart = priceExchange;
    if (!coin.amount) coin.amount = 1.0;
  }

  async updateCoinPrice(coinExchangeModel) {
    const priceExchange = await this.getPriceFromExchange(coinExchangeModel);
    this.initCoin(coinExchangeModel, priceExchange);

    const priceOrder = coinExchangeModel.priceOrder;
    const diff = priceExchange - priceOrder;
    const percent = (diff * 100) / priceOrder;
    coinExchangeModel.priceExchange = priceExchange;
    coinExchangeModel.priceChange = { diff, percent };
    coinExchangeModel.lastUpdate = new Date();
  }

  async getPriceFromExchange(coinModel) {
    const exchangeAdapter = this.getExchangeAdapter(coinModel.exchange);
    const priceExchange = await exchangeAdapter.getCoinPrice(
      coinModel.coin,
      coinModel.baseCoin
    );

    return priceExchange;
  }

  async startOrder(coinExchangeModel, orderType) {
    this.emit(EVENTS.MONITOR_MAKE_ORDER, coinExchangeModel, orderType);
    const response = await this.createExchangeOrder(
      coinExchangeModel,
      orderType
    );
    if (response.success) {
      coinExchangeModel.priceOrder = coinExchangeModel.priceExchange;
      coinExchangeModel.lastOrderType = orderType;
      await this.orderService.saveOrder(
        coinExchangeModel,
        response.orderId,
        orderType
      );
      this.emit(EVENTS.MONITOR_ORDER_DONE, coinExchangeModel, orderType);
    } else {
      this.emit(EVENTS.MONITOR_ORDER_ERROR, response.error, orderType);
    }
  }

  async createExchangeOrder(coinExchangeModel, orderType) {
    if (coinExchangeModel.tradeMode === TradeMonitorService.TRADE_MODE_LIVE) {
      const exchangeAdapter = this.getExchangeAdapter(
        coinExchangeModel.exchange
      );
      return await exchangeAdapter.makeOrder(coinExchangeModel, orderType);
    }

    return await this.makeSimulatedOrder(coinExchangeModel, orderType);
  }

  async makeSimulatedOrder(coinExchangeModel, orderType) {
    return Promise.resolve({
      success: true,
      orderId: `${Math.random()
        .toString(36)
        .substr(2, 5)}_sim`,
      type: orderType,
      price: coinExchangeModel.priceExchange,
      amount: coinExchangeModel.amount,
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
