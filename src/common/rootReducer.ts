import { combineReducers } from 'redux';
import { LOCATION_CHANGE, RouterState, LocationChangeAction } from 'react-router-redux';

import homeReducer from '@features/home/redux/reducer';
import commonReducer from '@features/common/redux/reducer';

const RootInitialState: RouterState = {
  location: null
};

function routerReducer(state = RootInitialState, action: LocationChangeAction): RouterState {
  if (action.type === LOCATION_CHANGE) {
    return {
      ...state,
      location: action.payload
    };
  }
  return state;
}

export const reducerMap = {
  router: routerReducer,
  home: homeReducer,
  common: commonReducer
};

export type RootReducerMap = typeof reducerMap;
export type RootReducerMapKey = keyof RootReducerMap;
export default combineReducers(reducerMap);
