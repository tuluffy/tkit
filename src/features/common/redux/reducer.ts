import { Action } from 'redux-actions';

import initialState, { IInitialState } from './initialState';
import { applyBreadcrumb } from './breadcrumb';
import { applyAsync } from './async';
import { default as doUserModel } from './userModel';

const reducers = [applyBreadcrumb, applyAsync, doUserModel.reducers];

type Reducer = <P>(state: IInitialState, action: Action<P>) => IInitialState;
export default function reducer<P>(state = initialState, action: Action<P>): IInitialState {
  switch (action.type) {
    // Handle cross-topic actions here
    default:
      state = { ...state };
      break;
  }
  /* istanbul ignore next */
  return reducers.reduce((s, r) => (r as Reducer)(s, action), state);
}
