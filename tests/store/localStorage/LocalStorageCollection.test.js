import noExports from '../../__mocks__/LocalStorageMock';
import LocalStorageCollection from "../../../src/store/localStorage/LocalStorageCollection";
import LocalStorageStore from "../../../src/store/localStorage/LocalStorageStore";

describe('LocalStorageCollection', () => {
  const store = new LocalStorageStore();
  const instance = new LocalStorageCollection(store, 'test');
  beforeEach(() => {
    instance.data = [];
  });

  test('create an instance', () => {
    expect(instance instanceof LocalStorageCollection).toBe(true);
  });

  test('findAll returns an array inverted', async () => {
    instance.data = [1, 2, 3];
    const arr = await instance.findAll();
    expect(arr).toEqual([3, 2, 1]);
  });

  test('insert creates a new record', async () => {
    const length = instance.data.length;
    const id = instance.insert({a:1, b:2});
    expect(instance.data.length).toBe(length + 1);
  });

  test('save updates existing record', async () => {
    const row = instance.insert({a:1, b:2});
    const id = row._id;
    const update = {_id:id, a:1, b:3};
    const updatedRow = await instance.save(update);

    expect(update).toEqual(updatedRow);
  });

  test('save new record when does not have id', async ()=> {
    const row = {a:1, b:3};
    const instertedRow = await instance.save(row);
    expect(instertedRow._id).toBeDefined();
  });

  test('findOne return the first matched record', async () => {
    instance.data = [{a:1, b:3}, {a: 4, b: 5, c: 6}];

    const item = await instance.findOne({a: 1});
    expect(item).toEqual({a:1, b:3});
  })

});