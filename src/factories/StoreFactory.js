import MongoStore from "../store/mongodb/MongoStore";
import LocalStorageStore from "../store/localStorage/LocalStorageStore";

const createStore = (name, params) => {
  switch (name) {
    case MongoStore.NAME:
      return new MongoStore(params);
    case LocalStorageStore.NAME:
      return new LocalStorageStore(params);
  }
};

export default createStore