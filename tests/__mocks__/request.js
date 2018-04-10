import fs from 'fs';
import env from '../../env';
const request = {};
request.post = request.get = (options) => new Promise((resolve, reject) => {
  let file = '';

  if (options.url.indexOf(env.BITSTAMP_API_URL + '/sell') > -1 ) {
    return resolve({
      "id": 1,
      "datetime": "2018-03-28 11:00:01",
      "type": 0,
      "price": 123,
      "amount": 2
    })
  }

  if (options.url.indexOf(env.BITSTAMP_API_URL + '/buy') > -1 ) {
    return resolve({
      "id": 1,
      "datetime": "2018-03-28 11:00:01",
      "type": 1,
      "price": 123,
      "amount": 2
    })
  }

  if (options.url.indexOf(env.BITSTAMP_API_URL + '/ticker') > -1 ) {
    file = './tests/__mocks__/bitstamp-ticker.json';
  }

  if (options.url.indexOf(env.BITSTAMP_API_URL + '/order_status') > -1 ) {
    file = './tests/__mocks__/bitstamp-order_status.json';
  }

  fs.readFile(file, 'utf8', (err, data) => {
    if (err)
      reject(err);
    else
      resolve(JSON.parse(data));
  })
});

export default request;
