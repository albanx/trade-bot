import StoreInterface from "../StoreInterface";
import mongo from 'mongodb';
import MongoCollection from "./MongoCollection";

export default class MongoStore extends StoreInterface {
  constructor({host, dbName}) {
    super();
    if (this.db) {
      return this;
    }

    this.host = host;
    this.dbName = dbName;
  }
  get NAME() {
    return 'mongodb';
  }

  async createCollection(name) {
    if(!this.db) {
      await this.getDatabase();
    }
    
    const collection = await this.db.createCollection(name);
    const collectionStandard = new MongoCollection(collection);
    return collectionStandard;
  }

  async getDatabase() {
    const client = await mongo.MongoClient.connect(this.host).catch(e => console.log('Error Connecting DB', e));
    this.db = client.db(this.dbName);
  }


}