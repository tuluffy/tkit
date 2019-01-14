import { pureBreadcrumbState } from './breadcrumb';
import { pureAsyncState } from './async';
import { userModelState } from './userModel';

const initialState = {
  ...pureBreadcrumbState,
  ...pureAsyncState,
  ...userModelState
};

export type IInitialState = Readonly<typeof initialState>;

export default initialState;
