export default class AbstractCollection {
  constructor(collection) {
    this.collection = collection;
  }

  async findAll(sort = -1) {
    const items = await this.collection.find({}, {sort: {$natural: sort}});
    return items.toArray();
  }

  async update(where, data) {
    const upsert = true;
    await this.collection.update(where, data, {upsert});
  }

  async saveModel(model) {
    if (!model.getId()) {
      delete model._id;
    }
    return await this.collection.save(model);
  }
}
