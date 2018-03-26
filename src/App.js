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
  amount: 2
});

const tradeCoins = [LTC_BITSTAMP];


const startTradingBot = async () => {
  const store = new Store(config.HOST_MONGO, config.DB_NAME);
  const database = await store.getDatabase();
  const coinExchangeCollection = new CoinExchangeCollection(database);
  const orderCollection = new OrderCollection(database);

  const mediator = new EventMediator();
  const dashboard = new Dashboard({});

  const coinExchangeService = new CoinExchangeService(coinExchangeCollection);
  const orderService = new OrderService(orderCollection, 8);
  const tradeService = new TradeMonitorService(coinExchangeService, orderService, mediator, tradeCoins);


  //display events
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

  await tradeService.start().catch(e => console.log(e));

};

startTradingBot().catch(e => console.log('error', e));


