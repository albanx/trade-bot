export class RequestException {
  constructor (message, error) {
    this.message = message;
    this.error = error.toString().substring(0, 50);
  }
}