import { Action } from 'redux-actions';

import initialState, { IInitialState } from './initialState';

const reducers = [];
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
