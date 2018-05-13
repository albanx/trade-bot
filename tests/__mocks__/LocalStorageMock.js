class LocalStorageMock {
  constructor() {
  }

  clear() {
    
  }

  getItem(key) {
    return this[key] || null;
  }

  setItem(key, value) {
    this[key] = value.toString();
  }

  removeItem(key) {
    delete this[key];
  }
};

global.localStorage = new LocalStorageMock;