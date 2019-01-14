import createModel, { Tction } from '@src/utils/createModel';
import { api } from '../services/';
import { IRootState } from '@src/types';
import { doBreadcrumb } from './breadcrumb';
import actions from './actions';

export interface IUserInfo {
  username: string;
  name: string;
  phone?: string | null;
  number?: string;
  photo: string;
  display_name?: string;
  // department?: {
  //   code: string
  //   name: string
  // }
  status: {
    code: string;
    name: string;
  };
}

export interface IUserListState {
  authority: null | string;
  userInfo: Common.CurrentUserInfo;
  userListInfo: {
    list: IUserInfo[];
    isFetch: boolean;
  };
}

export const userModelState: IUserListState = {
  authority: null,
  userInfo: {
    name: null,
    userId: null,
    userNo: null,
    avatar: null,
    email: null,
    authorities: []
  },
  userListInfo: {
    list: [],
    isFetch: false
  }
};

export const selectUserInfo = (state: IRootState): Common.CurrentUserInfo => state.common.userInfo;

export default createModel({
  state: userModelState,
  namespace: 'userModel',
  reducers: {
    // @params.0 state
    // @params.0 action
    // doSomething: (state, action: Tction<{ username: string }>) => {
    //   return {
    //     ...state,
    //     username: action.payload.username
    //   };
    // }
    doUser: (state, action: Tction<Common.CurrentUserInfo>) => {
      return {
        ...state,
        userInfo: action.payload
      };
    },
    doSetUserList: (state, action: Tction<IUserInfo[]>) => {
      return {
        ...state,
        userListInfo: {
          isFetch: false,
          list: action.payload
        }
      };
    }
  },
  effects: {
    // @params.0 sagaEffect
    // @params.0 action
    // *doSomethingAsync({ namespace, put }, action: Tction<{ username: string }>): Iterator<{}> {
    //   yield put({ type: `$\{namespace}/doLogin`, payload: { username: '' } });
    // }
    // *doTest({ tPut }): Iterator<{}> {
    //   yield tPut(doBreadcrumb, [{ path: '/', breadcrumbName: '2' }]);
    //   yield tPut(actions.doUserList, { name: 'nihao' });
    // },
    doUserInfo: [
      function*({ namespace, tCall, put, select }): Iterator<{}> {
        const userInfo = yield select(selectUserInfo);
        if (!userInfo || !userInfo.userId) {
          // instead of call, use tCall, more types checking support
          const res = yield tCall(api.api.userInfo);
          yield put({ type: `${namespace}/doUser`, payload: res.result });
        }
      },
      {
        type: 'takeLatest'
      }
    ],
    *doUserList({ namespace, call, put }, action: Tction<{ name: string }>): Iterator<{}> {
      const res = yield call(api.api.userList, action.payload);
      yield put({ type: `${namespace}/doSetUserList`, payload: res.result });
    }
  }
});
