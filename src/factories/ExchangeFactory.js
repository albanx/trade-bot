import request from "request";
import BitstampExchange from "../exchanges/BitstampExchange";
import BittrexExchange from "../exchanges/BittrexExchange";
import requestMock from "../../tests/__mocks__/request";
import env from '../../env';

/**
 *
 * @param name
 * @returns {ExchangeInterface}
 */
const createExchange = name => {
  const req = env.SIMULATION_MODE ? requestMock : request;
  switch (name) {
    case BitstampExchange.NAME:
      return new BitstampExchange(req);
    case BittrexExchange.NAME:
      return new BittrexExchange(req);
  }
};

export default createExchange;
