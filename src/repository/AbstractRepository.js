export default class AbstractRepository {
  constructor(collection) {
    this.collection = collection;
  }

  async findAll() {
    const items = await this.collection.findAll();
    return items;
  }

  async save(model) {
    if (!model.getId()) {
      delete model._id;
    }
    return await this.collection.save(model);
  }
}
