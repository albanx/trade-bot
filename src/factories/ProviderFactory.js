import BitstampProvider from "../providers/BitstampProvider";
import request from "request";
import BittrexProvider from "../providers/BittrexProvider";

/**
 *
 * @param name
 * @returns {BitstampProvider}
 */
const createProvider = (name) => {
  switch (name) {
    case BitstampProvider.NAME:
      return new BitstampProvider(request);
    case BittrexProvider.NAME:
      return new BitstampProvider(request);
  }
};

export default createProvider;
