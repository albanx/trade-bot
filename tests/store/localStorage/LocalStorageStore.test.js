import noExports from '../../__mocks__/LocalStorageMock';
import LocalStorageStore from "../../../src/store/localStorage/LocalStorageStore";
import LocalStorageCollection from "../../../src/store/localStorage/LocalStorageCollection";

describe('LocalStorageStore', () => {
  const instance = new LocalStorageStore();

  beforeEach(() => {
  });

  test('create an instance', () => {
    expect(instance instanceof LocalStorageStore).toBe(true);
  });

  test('createCollection creates a LocalStorageCollection', async () => {
    const collection = await instance.createCollection('test');
    expect(collection).toBeInstanceOf(LocalStorageCollection);
  });

  test('setItem adds item to localStorage', () => {
    instance.setItem('test', [1, 3]);
    expect(localStorage.test).toBeDefined();
    expect(localStorage.test).toBe(JSON.stringify([1, 3]));
  });

  test('getItem gets item from localStorage', () => {
    instance.setItem('test', [1, 3]);
    expect(instance.getItem('test')).toEqual([1, 3]);
    expect(instance.getItem('asdasd')).toBeNull();
  });

  test('removeItem removes item', () => {
    instance.setItem('test', [1, 3]);
    expect(instance.getItem('test')).toEqual([1, 3]);
    instance.removeItem('test');
    expect(instance.getItem('test')).toBeNull();
  });

});