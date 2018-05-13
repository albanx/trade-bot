import CollectionInterface from "../CollectionInterface";

//this is just a symbol interface as in JS interface are not possible
export default class MongoCollection extends CollectionInterface {
  constructor(dbCollection) {
    super();
    this.dbCollection = dbCollection;
  }

  async findAll() {
    const items = await this.dbCollection.find({}, {sort: {$natural: -1}});
    return items.toArray();
  }

  async save(model) {
    if (!model.getId()) {
      delete model._id;
    }
    return await this.dbCollection.save(model);
  }

  async find() {
    const items = await this.dbCollection.find();
    return items.toArray();
  }

  async findOne(filter) {
    return await this.collection.findOne(filter, {sort: {$natural: -1}});
  }
}