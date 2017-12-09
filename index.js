import request from 'request';
import Gdax from 'gdax';

const websocket = new Gdax.WebsocketClient(['BTC-USD']);
websocket.on('message', data => {
  console.log('Received data', data);
});

// const API_END_POINT = 'https://api.gdax.com';

// request('http://www.google.com', function(error, response, body) {
//   console.log('error:', error); // Print the error if one occurred
//   console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//   console.log('body:', body); // Print the HTML for the Google homepage.
// });

// const testURL =
//   'https://bittrex.com/api/v1.1/public/getmarketsummary?market=btc-ltc';
// const bitTrexApi = 'https://bittrex.com/api/v1.1/{method}?param=value';

// request(testURL, function(error, response, body) {
//   let json = JSON.parse(body);
//   console.log('Value LTC in BTC is ', json.result[0].Last);
// });
