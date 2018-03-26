export default class AbstractCollection {
  constructor(db) {
    this.db = db;
    this.name = '';
  }

  async getCollection() {
    if (!this.collection) {
      this.collection = await this.db.createCollection(this.name);
    }

    return Promise.resolve(this.collection);
  }

  async findAll(sort = -1) {
    const c = await this.getCollection();
    const items = await c.find({}, {sort: {$natural: sort}});
    return items.toArray();
  }

  async update(where, data) {
    const upsert = true;
    const collection = await this.getCollection();
    await collection.update(where, data, {upsert});
  }

  async saveModel(model) {
    const collection = await this.getCollection();
    if (!model.getId()) {
      delete model._id;
    }
    await collection.save(model);
  }
}
