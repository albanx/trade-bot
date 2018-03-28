export default class Collection {
  async find() {
    const items = {
      toArray: () => []
    };
    return Promise.resolve(items);
  }

  async findOne(sort = -1) {
    const items = await this.collection.find({}, {sort: {$natural: sort}});
    return items.toArray();
  }

  async update(where, data) {
    const upsert = true;
    return await this.collection.update(where, data, {upsert});
  }

  async save(model) {
    return Promise.resolve(`id_123`);
  }
}
