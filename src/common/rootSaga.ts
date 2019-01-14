import { all } from 'redux-saga/effects';
// @ts-ignore
import * as commonSaga from '@features/common/redux/sagas';
// @ts-ignore
import * as homeSaga from '@features/home/redux/sagas';
const featureSagas = [commonSaga, homeSaga];

const sagas = featureSagas
  .reduce((prev, curr) => [...prev, ...Object.keys(curr).map(k => curr[k])], [])
  .filter(s => typeof s === 'function');

export default function* rootSaga() {
  yield all(sagas.map(saga => saga()));
}
