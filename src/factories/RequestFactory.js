import request from 'request-promise-native';
import fetch from 'node-fetch';
import FetchWrapper from '../request/FetchWrapper';
import RequestWrapper from '../request/RequestWrapper';

//TODO integrate Browser fetch
/**
 *
 * @param name
 * @returns {RequestInterface}
 */
const createRequestor = name => {
  switch (name) {
    case FetchWrapper.NAME:
      return new FetchWrapper(fetch);
    case RequestWrapper.NAME:
      return new RequestWrapper(request);
  }
};

export default createRequestor;
