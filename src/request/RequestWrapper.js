/**
 * A Wrapper for node Request library
 * @implements RequestInterface
 */
export default class RequestWrapper {
  constructor(request) {
    this.request = request;
  }

  static get NAME() {
    return 'request';
  }

  async post(url, options) {
    return await this.request.post({ url, ...options });
  }

  async get() {
    return await this.request.get({ url, ...options });
  }
}