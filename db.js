import mongo from 'mongodb';
class DB {
  constructor(url) {
    if (!DB.instance) {
      DB.instance = this;
    }

    return DB.instance;
  }
}
