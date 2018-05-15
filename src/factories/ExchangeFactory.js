import BitstampExchange from '../exchanges/BitstampExchange';
import BittrexExchange from '../exchanges/BittrexExchange';
import createRequester from './RequestFactory';
/**
 *
 * @param name
 * @returns {ExchangeInterface}
 */

const requestObject = createRequester('node-fetch');
const createExchange = name => {
  switch (name) {
    case BitstampExchange.NAME:
      return new BitstampExchange(requestObject);
    case BittrexExchange.NAME:
      return new BittrexExchange(requestObject);
  }
};

export default createExchange;
