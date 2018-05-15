/**
 * A Wrapper for the node-fetch library
 * @implements RequestInterface
 */
export default class FetchWrapper {
  constructor(fetch) {
    this.fetch = fetch;
  }

  static get NAME() {
    return 'node-fetch';
  }

  //TODO manage non json responses
  async post(url, { params = {}, timeout = 0 }) {
    const body = Object.keys(params).map(key =>`${key}=${encodeURIComponent(params[key])}`).join('&');
    const response = await this.fetch(url, { method: 'POST', body, timeout });
    const json = await response.json();
    return json;
  }

  async get(url) {
    const response = await this.fetch(url, { method: 'GET' });
    const json = await response.json();
    return json;
  }
}