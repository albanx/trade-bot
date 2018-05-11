
import Pusher from 'pusher-js/node';
let minPrice = 0;
let maxPrice = -1;

global.appLog = (...msg) => {
  console.log(msg);
};

startWebSocket => () {
  appLog('starting websocket');
  const pusher = new Pusher(env.BITSTAMP_PUSHER_KEY, {
    cluster: 'mt1',
    encrypted: true
  });

  pusher.connection.bind("connected", () => {
    appLog("connected");
  });

  pusher.connection.bind("disconnected", () => {
    appLog("disconnected");
  });

  const tradesChannel = pusher.subscribe('live_trades_btceur');
  tradesChannel.bind('trade', function (data) {
    appLog('(' + data.timestamp + ') ' + data.id + ': ' + data.amount + ' BTC @ ' + data.price + ' USD ' + data.type);
  });
}