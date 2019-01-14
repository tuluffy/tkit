import { createAction, handleActions, Action } from 'redux-actions';

import { IInitialState } from './initialState';

export const BREADCRUMB = 'common/BREADCRUMB';

export const doBreadcrumb = createAction(
  BREADCRUMB,
  (breadcrumbs: IBreadcrumbState['breadcrumbs']) => ({ breadcrumbs })
);

export interface IBreadcrumbState {
  // use Readonly
  // doBreadcrumb: Readonly<{}>
  breadcrumbs: Array<{ path: string; breadcrumbName: string }>;
}

export const pureBreadcrumbState: IBreadcrumbState = {
  breadcrumbs: []
};

export const applyBreadcrumb = handleActions(
  {
    [BREADCRUMB]: (
      state: IInitialState,
      action: Action<{ breadcrumbs: IBreadcrumbState['breadcrumbs'] }>
    ) => {
      return {
        ...state,
        ...action.payload
      };
    }
  },
  pureBreadcrumbState
);
