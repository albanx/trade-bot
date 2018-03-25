export default class AbstractModel {

  constructor() {
  }

  getId() {
    return this._id;
  }

  toObject() {
    return {...this};
  }
}
