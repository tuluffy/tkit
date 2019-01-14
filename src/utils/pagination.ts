import { createAction, handleActions, Action } from 'redux-actions';
import { put, call, select, takeLatest, all } from 'redux-saga/effects';

import { IRootState } from '@src/types';

export type GetListItemType<L> = L extends { result: { list: Array<infer I> } } ? I : never;
export type ListParams = Partial<Utils.PagenationParams>;
const DEFAULY_ROW_KEY = 'id';

export function pagination<F extends Utils.BasicAsyncFunction, K extends string>(
  key: K,
  params: ListParams,
  fetch: F,
  rowKey: string = DEFAULY_ROW_KEY,
  feature?: string
) {
  if (typeof feature === 'undefined') {
    feature = key.split('/')[0];
    // @ts-ignore
    // @ts-nocheck
    key = key.split('/')[1];
  }
  if (!feature) {
    throw Error(
      `storeKey must be 'featureName/storeName' like, but received ${key}, or pass feature as 5th argument`
    );
  }
  const storeKey = `${feature}`;
  type ListResult = Utils.GetPromiseResolved<ReturnType<F>>;
  type ListItem = GetListItemType<ListResult>;
  type List = Utils.PagenationStateBase<ListItem>;
  type Store = { [k in K]: List };
  interface SelectPayload {
    selectedRowKeys?: List['selectedRowKeys'];
    rowKey?: string;
  }
  const initialState: Store = {
    [key]: {
      pageData: [],
      total: 0,
      params: {
        current: 1,
        pageNum: 1,
        pageSize: 10,
        ...params
      },
      rowKey, // 默认是 id
      selectedRowKeys: [], // 列表选中
      loading: true,
      isfetch: true, // 加载loader显示与隐藏
      fetchError: false // 失败后弹窗
    }
  };
  const CHANGE_PAGE = `${storeKey}/CHANGE_PAGE`;
  const CHANGE_PAGE_SELECTED = `${storeKey}/CHANGE_PAGE_SELECTED`;
  const CHANGE_PAGE_SUCCESS = CHANGE_PAGE + '_SUCCESS';
  const CHANGE_PAGE_FAILED = CHANGE_PAGE + '_FAILED';
  const doChangePage = createAction(CHANGE_PAGE, (params: Partial<List['params']>) => ({
    params
  }));
  const doSelectedRowKeys = createAction(CHANGE_PAGE_SELECTED, (payload: SelectPayload) => payload);

  const selectParams = (store: IRootState) => store[feature || ''][key].params;

  const selectReducer = (state: Store, action: Utils.ActionWithPayload<SelectPayload>): Store => {
    const {
      [key]: { pageData, selectedRowKeys: listRowSelectKeys, rowKey: listRowKey = DEFAULY_ROW_KEY }
    } = state;
    const { selectedRowKeys = listRowSelectKeys, rowKey = listRowKey } = action.payload;
    const existKeys: null | { [str: string]: '' } = Array.isArray(pageData)
      ? pageData.reduce((mp, cur) => {
          mp[cur[rowKey]] = '';
          return mp;
        }, {})
      : null;
    return {
      ...state,
      [key]: {
        ...state[key],
        selectedRowKeys: existKeys ? selectedRowKeys.filter(id => id in existKeys) : emptyArr
      }
    };
  };

  function* fetchData(action: Action<List>) {
    let res;
    try {
      const params = action.payload ? action.payload.params : {};
      const { current, pageNum, pageSize } = yield select(selectParams);
      // merge 标准参数
      const newParams = { current, pageNum, pageSize, ...params };
      newParams.pageNum = Number(newParams.pageNum);
      newParams.pageSize = Number(newParams.pageSize);
      res = yield call(fetch, newParams); // 请求数据
      res = {
        ...(res && res.code ? res : { pageData: res }),
        params: newParams
      };
    } catch (err) {
      res = {
        code: 10002,
        message: err.message
      };
    }
    yield put({
      type: res && res.code ? CHANGE_PAGE_FAILED : CHANGE_PAGE_SUCCESS,
      payload: res
    });
  }

  function* sagaChangePage() {
    yield all([
      takeLatest(CHANGE_PAGE_SUCCESS, () =>
        put({ type: CHANGE_PAGE_SELECTED, payload: { selectedRowKeys: emptyArr } })
      ),
      takeLatest(CHANGE_PAGE, fetchData)
    ]);
  }

  const emptyArr: [] = [];

  const applyChangePage = handleActions(
    {
      [CHANGE_PAGE_SELECTED]: selectReducer,
      [CHANGE_PAGE]: (state: Store, action: Action<ListParams>) => {
        return {
          ...state,
          [key]: {
            ...state[key],
            pageData: [],
            isfetch: true,
            loading: true
          }
        };
      },
      [CHANGE_PAGE_SUCCESS]: <
        S extends { total?: number; pageData?: List | ListResult; params: ListParams }
      >(
        state: Store,
        action: Action<S>
      ) => {
        const { payload = {} as S } = action;
        let { total = 0 } = payload;
        const { pageData } = payload;
        let pageDataArr = pageData;
        let { pageSize } = state[key].params;
        if (pageData && !Array.isArray(pageData)) {
          const { result } = pageData as ListResult;
          if (result) {
            if (Array.isArray(result.list)) {
              pageDataArr = result.list;
            }
            total = result.total || total;
            pageSize = result.pageSize || pageSize;
          }
        }
        const newStore = {
          ...state[key],
          total,
          pageData: pageDataArr || emptyArr,
          fetchError: false,
          isfetch: false,
          loading: false,
          params: {
            pageNum: payload.params.pageNum || state[key].params.pageNum,
            pageSize
          }
        };
        (newStore.params as Utils.PagenationParams).current = newStore.params.pageNum = Number(
          newStore.params.pageNum
        );
        newStore.params.pageSize = Number(pageSize);
        return {
          ...state,
          [key]: newStore
        };
      },
      [CHANGE_PAGE_FAILED]: (state: Store, action: Action<{ code: number; message: string }>) => {
        const newStore = {
          ...state[key],
          fetchError: action.payload,
          isfetch: false,
          loading: false,
          total: 0,
          params: {
            pageNum: 0,
            pageSize: state[key].params.pageSize
          }
        };
        return {
          ...state,
          [key]: newStore
        };
      }
    },
    initialState
  );

  return {
    initialState,
    store: initialState[key],
    fetchData,
    action: doChangePage,
    selectAction: doSelectedRowKeys,
    reducer: applyChangePage,
    selectReducer,
    saga: sagaChangePage,
    selectParams,
    START: CHANGE_PAGE,
    SUCCESS: CHANGE_PAGE_SUCCESS,
    SELECTED: CHANGE_PAGE_SELECTED,
    FAILED: CHANGE_PAGE_FAILED
  };
}
