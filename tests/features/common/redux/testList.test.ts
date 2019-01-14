import {
  TEST_LIST,
  TEST_LIST_SUCCESS,
  doTestList,
  initialState,
  pureTestListState,
  applyTestList
} from '@src/features/common/redux/testList';

describe('jobs/redux/doTestList', () => {
  it('correct action by doTestList', () => {
    expect(doTestList({})).toHaveProperty('type', TEST_LIST);
  });

  it('handles action type doTestList correctly', () => {
    // in case of spell error
    expect(initialState).toMatchObject(pureTestListState);
    const prevState = {
      ...pureTestListState
    };
    const state = applyTestList(prevState, { type: TEST_LIST_SUCCESS, payload: {} });
    expect(state === prevState).toBeFalsy();
  });
});
