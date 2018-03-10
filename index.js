import request from 'request';
import mongo from 'mongodb';
import Kraken from './providers/kraken';
import config from './config';

const krakenApi = new Kraken('', '', {});
const MARKETS = [];

const openDB = async () => {
    const client = await mongo.MongoClient.connect(config.HOST_MONGO);
    return client.db(config.DB_NAME);
};

const getPriceTable =  async (db) => {
  const collection = await db.collection(config.TABLE_COIN);
  return collection;
};

const getUTCDate = () => {
    const d = new Date();
    const leadingZero = (num) => `0${num}`.slice(-2);

    const formatTime = (date) =>
        [date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()]
            .map(leadingZero)
            .join(':');

    return d.getUTCFullYear() + '-' +
        d.getUTCMonth() + '-' +
        d.getUTCDate() + ' ' +
        formatTime(d);
};





const startTradingBot = async () => {
  const db = await openDB();
  const table = await getPriceTable(db);
  
};

const checkCoinPrice = async (name, market) => {
    let {client, collection} = await openDB().catch(err => console.log('Error ', err));
    let coin = await collection.findOne({name, market});
    console.log('checkCoinPrice::', coin);
    client.close();
};


const updateCoinPrice = async (price, market, time) => {
    console.log('updateCoinPrice::', price, market);
    let {client, collection} = await openDB().catch(err => console.log('Error ', err));
    collection.createIndex( { name: 1, market: 1 }, { unique: true } )

    collection.update({
        'name': 'BTC',
        'market': 'kraken'
    }, {
        'name': 'BTC',
        'market': market,
        'price': price,
        'time': time
    }, {
        upsert: true
    });
    client.close();
    console.log('updateCoinPrice::done');
};

const callKrakenApi = async () => {
    console.log('callKrakenApi::');
    const data = await krakenApi.api('Ticker', { pair : 'XXBTZEUR' });
    const price = data.result['XXBTZEUR'].b[0];
    console.log('callKrakenApi::', price);

    updateCoinPrice(price, 'kraken', getUTCDate()).catch(err => {
        console.log('Cannot update price ', err);
    })
};

checkCoinPrice('BTC', 'kraken');
callKrakenApi();


// const websocket = new Gdax.WebsocketClient(['BTC-USD']);
// websocket.on('message', data => {
//   console.log('Received data', data);
// });

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
