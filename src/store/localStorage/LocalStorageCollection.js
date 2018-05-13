import CollectionInterface from "../CollectionInterface";

export default class LocalStorageCollection extends CollectionInterface {
  constructor(store, name, data = []) {
    super();
    this.data = data;
    this.store = store;
    this.name = name;

  }  

  async findAll() {
    return Promise.resolve(this.data.reverse());
  }

  async save(row) {
    if (!row._id) {
      delete row._id;
    }

    const item = this.data.find(item => item._id === row._id);
    item ?  Object.assign(item, row) :  this.insert(row);

    this.persist();
    
    return Promise.resolve(row);
  }

  async update(filter, values) {
    //TODO manage upsert
    this.data.filter(filter).forEach(item => {
      Object.assign(item, values);
    });

    this.persist();
  }

  insert(row) {
    row._id = this.data.length + 1;
    this.data.push(row);
    return row;
  }

  persist() {
    this.store.setItem(this.name, this.data);
  }

  async find() {
    return Promise.resolve(this.data);
  }

  async findOne(filter) {
    const item = this.data.find(item => {
      for(let key in filter) {
        if (filter[key] !== item[key]) {
          return false;
        }
      }

      return true;
    });

    return Promise.resolve(item);
  }
}