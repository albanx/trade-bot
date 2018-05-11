import LocalStorage from "./LocalStorage";

export default class AbstractRepository {
  constructor(name) {
    this.store = new LocalStorage(name);
  }

  async findAll(sort = -1) {
    const items = this.store.getItem();
    if (items.length) return items;
    return [];
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
