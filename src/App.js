import config from '../config';
import Store from './Store';
import CoinExchangeService from './services/CoinExchangeService';
import CoinExchangeCollection from './collections/CoinExchangeCollection';
import OrderCollection from './collections/OrderCollection';
import OrderService from './services/OrderService';
import Dashboard from './Dashboard';
import TradeMonitorService from "./services/TradeMonitorService";
import createCoinExchange from "./factories/CoinExchangeFactory";
import BitstampExchange from "./exchanges/BitstampExchange";
import EventMediator from "./EventMediator";
import EVENTS from "./Events";


const LTC_BITSTAMP = createCoinExchange({
  coin: 'LTC',
  exchange: BitstampExchange.NAME,
  baseCoin: 'EUR',
  amount: 1
});

const tradeCoins = [LTC_BITSTAMP];


const startTradingBot = async () => {
  const store = new Store(config.HOST_MONGO, config.DB_NAME);
  const database = await store.getDatabase();
  const coinExchangeCollection = await database.createCollection('coin_exchange');
  const orderCollection = await database.createCollection('orders');

  const coinExchangeRepo = new CoinExchangeCollection(coinExchangeCollection);
  const orderRepo = new OrderCollection(orderCollection);

  const mediator = new EventMediator();
  const dashboard = new Dashboard({});

  const coinExchangeService = new CoinExchangeService(coinExchangeRepo);
  const orderService = new OrderService(orderRepo, 8);
  const tradeService = new TradeMonitorService(coinExchangeService, orderService, mediator, tradeCoins);


  //display events
  mediator.on(EVENTS.MONITOR_START, () => dashboard.log('Monitor start'));
  mediator.on(EVENTS.MONITOR_LOAD_COINS, () => dashboard.log('Loading coins'));
  mediator.on(EVENTS.MONITOR_CYCLE, async coins => {

    //current coin to monitor
    dashboard.setPriceMonitorLabel(`Price Monitor - ${new Date()}`);
    dashboard.addPriceMonitorRows(coins.map(c => [
        c.getId().toString().substring(0, 4),
        c.getCoin(),
        c.getExchange(),
        c.getPriceStart().toString(),
        c.getPriceExchange().toString(),
        c.getPriceOrder().toString(),
        c.getPriceChange().toString()
      ]
    ));

    //next order preview
    dashboard.addRowNextAction( await Promise.all(coins.map(async c => {
      const nextOrderType = await orderService.getNextOrderType(c.getId(), c.getPriceChange(), true);
      const priceNextOrder = orderService.getPriceNextOrder(c.getPriceOrder(), nextOrderType);
      const nextText = `${nextOrderType}@${priceNextOrder}`;

      return [
        c.getId().toString().substring(0, 4),
        c.getCoin(),
        c.getExchange(),
        nextText,
        c.getAmount()
      ];
    })));


    //display current done orders
    const orders = await orderService.getOrders();
    dashboard.addRowOrders(orders.map(o => [
      o.getCoin(),
      o.getExchange(),
      o.getExchangeOrderId(),
      o.getStatus(),
      o.getPriceOrder(),
      o.getOrderType()
    ]));
  });

  mediator.on('MONITOR_MAKE_ORDER', (coinExchangeModel, orderType) => dashboard.log('Making order', orderType));
  mediator.on('MONITOR_ORDER_DONE', () => dashboard.log('Order done'));
  await tradeService.start().catch(e => dashboard.error(e));

};

startTradingBot().catch(e => console.log('error', e));


