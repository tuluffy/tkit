import { takeLatest, put } from 'redux-saga/effects';

import { default as doUserModel } from './userModel';
import { LOCATION_CHANGE } from 'react-router-redux';

export { sagaAsync } from './async';

export const sagaUserModel = doUserModel.sagas;
export function* sagaUserInfo() {
  yield takeLatest(LOCATION_CHANGE, function*() {
    yield put({ type: doUserModel.TYPES.doUserInfo });
  });
}
