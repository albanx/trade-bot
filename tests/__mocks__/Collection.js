export default class Collection {
  async find() {
    return Promise.resolve([]);
  }

  async findOne() {
    const item = await this.find();
    return item;
  }

  async save(model) {
    return Promise.resolve(`id_123`);
  }

  async findLastOrder(id) {

  }
}
