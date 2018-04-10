export class AppRequestException extends Error {
  constructor (message, error) {
    super();
    this.message = message;
    this.error = error.toString().substring(0, 50);
  }
}