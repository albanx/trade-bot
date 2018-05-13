import StoreInterface from "../StoreInterface";
import LocalStorageCollection from "./LocalStorageCollection";

export default class LocalStorageStore extends StoreInterface {
  constructor() {
    super();
    if (!window || !window.localStorage) {
      throw 'LocalStorage not supported';
    }
  }

  get NAME() {
    return 'localStorage';
  }

  async createCollection(name) {
    let arr = this.getItem(name);
    if (!arr) {
      arr = [];
      this.setItem(name, arr);
    }

    const collection = new LocalStorageCollection(this, name, arr);
    return Promise.resolve(collection);
  }

  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getItem(key) {
    const jsonString = localStorage.getItem(key);
    try { 
     return JSON.parse(jsonString);
   } catch(e) {

   }

   return null;
  }

  removeItem(key) {
    localStorage.removeItem(key);
  }
}
