import fs from 'fs';
import env from '../../env';
const request = {};
request.post = request.get = (options) => new Promise((resolve, reject) => {
  let file = '';

  if (options.url.indexOf(env.BITSTAMP_API_URL + '/sell') > -1 ) {
    file = './tests/__mocks__/bitstamp-sell-response.json';
  }

  if (options.url.indexOf(env.BITSTAMP_API_URL + '/buy') > -1 ) {
    file = './tests/__mocks__/bitstamp-buy-response.json';
  }

  fs.readFile(file, 'utf8', (err, data) => {
    if (err)
      reject(err);
    else
      resolve(JSON.parse(data));
  })
});

export default request;
