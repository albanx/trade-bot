export default class LocalStorage {
  constructor(collection) {
    this.key = collection;
  }

  setItem(value) {
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  getItem() {
    const jsonString = localStorage.getItem(this.key);
    try { 
     return JSON.parse(jsonString);
   } catch(e) {

   }

   return null;
  }

  removeItem() {
    localStorage.removeItem(this.key);
  }
}