import { call, put, select } from 'redux-saga/effects';

import { pagination, ajax } from '@src/utils';

const pageData = [{ id: 2 }, { id: 3 }];
const TestData = { code: 0, result: { list: pageData } };
const Data401 = { code: 401, message: 'OK' };
const api = '/api/get';
const params = { a: 2, b: 1 };
const pageParams = { current: 1 };
const selectPayload = { selectedRowKeys: [2], rowKey: 'name' };

const storeKey = 'test';

describe('utils/WrappedFetch work ok', () => {
  const fetcher = (p: any) => ajax.get(api, p);
  const {
    initialState,
    reducer,
    action,
    START,
    SELECTED,
    SUCCESS,
    FAILED,
    fetchData,
    selectParams,
    selectAction
  } = pagination(`${storeKey}/${storeKey}`, params, fetcher);

  it('wrapped ok', () => {
    expect(initialState).toHaveProperty(storeKey);
    expect(action({})).toHaveProperty('type', START);
    expect(selectAction(selectPayload)).toMatchObject({ type: SELECTED, payload: selectPayload });
    expect(selectParams({ [storeKey]: { [storeKey]: { params: 2 } } } as any)).toEqual(2);
  });

  it('saga ok', async () => {
    let generator = fetchData({ payload: { params } });
    let next = generator.next();
    expect(next.value).toMatchObject(select(selectParams));
    next = generator.next(pageParams);
    expect(next.value).toMatchObject(call(fetcher, { ...pageParams, ...params }));
    next = generator.next(Data401);
    expect(next.value).toMatchObject(put({ type: FAILED, payload: Data401 }));
    generator = fetchData({ payload: { params } });
    next = generator.next();
    next = generator.next(pageParams);
    expect(next.value).toMatchObject(call(fetcher, { ...pageParams, ...params }));
    next = generator.next(TestData);
    expect(next.value).toMatchObject(put({ type: SUCCESS, payload: { pageData: TestData } }));
  });

  it('reducer ok', () => {
    const store = {
      ...initialState
    };
    expect(store).toHaveProperty(storeKey);
    const loadingStore = reducer(store, { type: START, payload: { pageData: TestData } });
    expect(loadingStore[storeKey]).toHaveProperty('loading', true);
    const successStore = reducer(loadingStore, { type: SUCCESS, payload: { pageData: TestData } });
    expect(successStore[storeKey]).toHaveProperty('pageData', pageData);
    const selectedStore = reducer(successStore, {
      type: SELECTED,
      payload: { selectedRowKeys: [2, 5] }
    });
    expect(selectedStore[storeKey]).toHaveProperty('selectedRowKeys', [2]);
    const failedStore = reducer(selectedStore, { type: FAILED, payload: Data401 });
    expect(failedStore[storeKey]).toHaveProperty('fetchError', Data401);
  });
});
