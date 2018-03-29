export default class Collection {
  async find() {
    const items = {
      toArray: () => []
    };
    return Promise.resolve(items);
  }

  async findOne() {
    const item = await this.find();
    return item;
  }

  async update(where, data) {
    const upsert = true;
    return await this.collection.update(where, data, {upsert});
  }

  async save(model) {
    return Promise.resolve(`id_123`);
  }

  async findLastOrder(id) {

  }
}
