import { pagination } from '@src/utils/';
import { api } from '../services/';

const { START, SUCCESS, initialState, reducer, action, selectAction, saga } = pagination(
  'testList',
  { pageSize: 20 },
  api.api.testList,
  'id',
  'home'
);

// for autocomplete
export const pureTestListState = initialState;
export const doSelectTestList = selectAction;
export const doTestList = action;
export const applyTestList = reducer;
export const sagaTestList = saga;
export const TEST_LIST = START;
export const TEST_LIST_SUCCESS = SUCCESS;
