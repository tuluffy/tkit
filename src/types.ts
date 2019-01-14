import { RouterAction, LocationChangeAction } from 'react-router-redux';

import { RootReducerMapKey, reducerMap } from '@src/common/rootReducer';

type ReactRouterAction = RouterAction | LocationChangeAction;

export type RootState = { [P in RootReducerMapKey]: ReturnType<typeof reducerMap[P]> };

export type IRootState = Readonly<RootState>;

export type RootAction = ReactRouterAction;

export type AyncComponentLoader = () => Promise<any>;

export interface IRoute {
  autoIndexRoute?: boolean;
  childRoutes?: IRoute[];
  component?: React.ComponentClass | React.SFC;
  exact?: boolean;
  isIndex?: boolean;
  name?: any;
  path: string;
  redirect?: string;
  load?: AyncComponentLoader;
}

export interface IObject {
  [key: string]: any;
}
