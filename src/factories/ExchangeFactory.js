import request from 'request-promise-native';
import BitstampExchange from '../exchanges/BitstampExchange';
import BittrexExchange from '../exchanges/BittrexExchange';

/**
 *
 * @param name
 * @returns {ExchangeInterface}
 */
const createExchange = name => {
  switch (name) {
    case BitstampExchange.NAME:
      return new BitstampExchange(request);
    case BittrexExchange.NAME:
      return new BittrexExchange(request);
  }
};

export default createExchange;
