import AbstractModel from "./AbstractModel";

export default class CoinExchangeModel extends AbstractModel {
  constructor(params) {
    super();
    Object.assign(this, params);
  }
}
