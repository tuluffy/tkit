import { createAction, handleActions, Action } from 'redux-actions';
import { call, put, takeEvery } from 'redux-saga/effects';

import { IInitialState } from '../redux/initialState';
import { ModalFuncProps } from 'antd/es/modal/Modal.d';
import { IFormProps } from '@src/features/common/Form';
import { i18n, EventCenter } from '@src/utils';
import { Omit } from 'react-redux';

export const ASYNC = 'common/ASYNC';
export const ASYNC_CONFIRMED = ASYNC + '_CONFIRMED';
export const ASYNC_SUCCESS = ASYNC + '_SUCCESS';
export const ASYNC_FAILED = ASYNC + '_FAILED';

// 无参数情形下: 不能返回任何值
type EnsureArgumentsType<F extends Utils.BasicAsyncFunction> = Utils.GetArgumentsType<F> extends []
  ? never | void
  : Utils.GetArgumentsType<F>;
// 仅返回一个参数情形下，第一个参数类型
type EnsureSingleArgumentsType<F extends Utils.BasicAsyncFunction> = Utils.GetArgumentsType<
  F
>[1] extends undefined | never
  ? Utils.GetArgumentsType<F>[0]
  : never;

export interface NewAsyncParams<F extends Utils.BasicAsyncFunction> {
  params?: EnsureSingleArgumentsType<F>;
  callback?: (res: Utils.GetReturnTypeOfAsyncFun<F>) => any;
  onError?: (res: Utils.GetReturnTypeOfAsyncFun<F>) => any;
  onSuccess?: (res: Utils.GetReturnTypeOfAsyncFun<F>) => any;
  errorMsg?: ((res: Utils.GetReturnTypeOfAsyncFun<F>) => React.ReactNode) | React.ReactNode;
  successMsg?: ((res: Utils.GetReturnTypeOfAsyncFun<F>) => React.ReactNode) | React.ReactNode;
  paramsGenerator?: (params: NewAsyncParams<F>) => EnsureArgumentsType<F>;
  ASYNC_ID?: number;
  extraParams?: EnsureSingleArgumentsType<F>; // 表单情形下返回数据
}

export interface IAsyncConfirmedParams<F extends Utils.BasicAsyncFunction>
  extends NewAsyncParams<F> {
  fetch: F;
}

export interface IAsyncActionProps<F extends Utils.BasicAsyncFunction> extends NewAsyncParams<F> {
  fetch: F;
  modalProps?: ModalFuncProps;
  formProps?: IFormProps;
}

// 单个异步操作
export type AsyncStatus = {
  confirmed?: boolean;
  isFetch?: boolean;
  isSuccess?: boolean;
  response?: any;
  ASYNC_ID?: number;
} & Omit<IAsyncActionProps<Utils.BasicAsyncFunction>, 'fetch'>;

// 队伍
export interface IAsyncState {
  asyncStatus: AsyncStatus[];
}

let ASYNC_ID: number = 1;

const confirmedPayloadCreator = <F extends Utils.BasicAsyncFunction>(
  payload: IAsyncConfirmedParams<F>,
  fetch?: F
) => {
  if (fetch) {
    payload.fetch = fetch;
  }
  const { onError, onSuccess, callback, ASYNC_ID: id = ASYNC_ID++ } = payload;
  return {
    ...payload,
    ASYNC_ID: id,
    callback: (res: Utils.GetReturnTypeOfAsyncFun<F>) => {
      if (!res.code) {
        if (onSuccess) {
          onSuccess(res);
        }
      } else {
        if (onError) {
          onError(res);
        }
      }
      if (callback) {
        callback(res);
      }
    }
  };
};

export const doNewAsync: <F extends Utils.BasicAsyncFunction>(
  fetch: F,
  params: Omit<IAsyncActionProps<F>, 'ASYNC_ID' | 'extraParams' | 'fetch'>
) => any = createAction(
  ASYNC,
  <F extends Utils.BasicAsyncFunction>(
    fetch: F,
    payload: Omit<IAsyncActionProps<F>, 'ASYNC_ID' | 'extraParams' | 'fetch'>
  ) => {
    ASYNC_ID++;
    return { ...payload, fetch, ASYNC_ID };
  }
);
export const doNewAsyncConfirmed: <F extends Utils.BasicAsyncFunction>(
  fetch: F,
  params: Omit<NewAsyncParams<F>, 'extraParams'>
) => any = createAction(
  ASYNC_CONFIRMED,
  <F extends Utils.BasicAsyncFunction>(fetch: F, payload: NewAsyncParams<F>) =>
    confirmedPayloadCreator({ ...payload, fetch })
);
export const doAsync: <F extends Utils.BasicAsyncFunction>(
  payload: Omit<IAsyncActionProps<F>, 'ASYNC_ID' | 'extraParams'>
) => any = createAction(
  ASYNC,
  <F extends Utils.BasicAsyncFunction>(payload: Omit<IAsyncActionProps<F>, 'ASYNC_ID'>) => ({
    ...payload,
    ASYNC_ID: ASYNC_ID++
  })
);
export const doAsyncConfirmed: <F extends Utils.BasicAsyncFunction>(
  payload: Omit<IAsyncConfirmedParams<F>, 'extraParams'>
) => any = createAction(ASYNC_CONFIRMED, confirmedPayloadCreator);
export const doAsyncCancel = createAction(ASYNC_SUCCESS, (ASYNC_ID: number) => ({
  ASYNC_ID,
  successMsg: false
}));
export const doAsyncError = createAction(
  ASYNC_FAILED,
  (ASYNC_ID: number, error: string | { code: number; message: React.ReactNode }) => ({
    ASYNC_ID,
    isSuccess: false,
    response:
      typeof error === 'object'
        ? error
        : {
            code: 10003,
            message: error
          }
  })
);

export function* fetchData<F extends Utils.BasicAsyncFunction>(
  action: Utils.ActionWithPayload<IAsyncConfirmedParams<F>>
) {
  let res;
  const { paramsGenerator, params, extraParams, fetch, callback, ASYNC_ID } = action.payload;
  try {
    // 参数类型处理
    const mergedParams: any[] = [];
    if (typeof paramsGenerator === 'function') {
      const generatedParams = paramsGenerator(action.payload);
      mergedParams.push.apply(
        mergedParams,
        Array.isArray(generatedParams) ? generatedParams : [generatedParams]
      );
    } else {
      const isParamsArray = Array.isArray(params);
      const isExtraPramssArray = Array.isArray(extraParams);
      // 不对数组进行 merge，如有需要
      if (isParamsArray && isExtraPramssArray) {
        const msg = `当 fetch 拥有多个参数情形下, async 无法正确处理，请在 paramsGenerator 内处理`;
        console.error(msg);
        throw Error(msg);
      } else if (!isParamsArray! && !isExtraPramssArray) {
        // 仅 merge object
        mergedParams.push.apply(mergedParams, [
          (params && typeof params === 'object') || (extraParams && typeof extraParams === 'object')
            ? { ...params, ...extraParams }
            : extraParams || params
        ]);
      } else if (isParamsArray || isExtraPramssArray) {
        mergedParams.push.apply(mergedParams, isParamsArray ? params : extraParams);
      }
    }
    res = yield call.apply(null, [fetch, ...mergedParams]);
  } catch (err) {
    res = {
      code: 10002,
      message: err.message
    };
  }
  if (callback) {
    callback(res);
  }
  const isSuccess = !(res && res.code);
  yield put({
    type: isSuccess ? ASYNC_SUCCESS : ASYNC_FAILED,
    payload: {
      ASYNC_ID,
      isSuccess,
      response: res
    }
  });
}

export function* sagaAsync() {
  yield takeEvery(ASYNC_CONFIRMED, fetchData);
}

export const pureAsyncState: IAsyncState = {
  asyncStatus: []
};
export const applyAsync = handleActions(
  {
    [ASYNC]: (
      state: IInitialState,
      action: Utils.ActionWithPayload<AsyncStatus>
    ): IInitialState => {
      return {
        ...state,
        asyncStatus: state.asyncStatus.concat([
          {
            errorMsg: null,
            successMsg: null,
            ...action.payload,
            response: null,
            isFetch: false,
            confirmed: false
          }
        ])
      };
    },
    [ASYNC_CONFIRMED]: (
      state: IInitialState,
      action: Utils.ActionWithPayload<AsyncStatus>
    ): IInitialState => {
      const id = (action.payload && action.payload.ASYNC_ID) || -1;
      let isNew = true;
      const newStatus = state.asyncStatus.map(status => {
        if (status.ASYNC_ID === id) {
          isNew = false;
          const newStatus: AsyncStatus = {
            errorMsg: null,
            successMsg: null,
            ...status,
            ...action.payload,
            response: null,
            isFetch: true,
            confirmed: true
          };
          return newStatus;
        }
        return status;
      });
      if (isNew) {
        newStatus.push({
          errorMsg: null,
          successMsg: null,
          ...action.payload,
          response: null,
          isFetch: true,
          confirmed: true
        });
      }
      return {
        ...state,
        asyncStatus: newStatus
      };
    },
    [ASYNC_SUCCESS]: (
      state: IInitialState,
      action: Utils.ActionWithPayload<AsyncStatus>
    ): IInitialState => {
      const { ASYNC_ID: id, successMsg, response } = action.payload as AsyncStatus;
      return {
        ...state,
        asyncStatus: state.asyncStatus.filter(status => {
          if (status.ASYNC_ID === id) {
            const { successMsg: successMsgInStore } = status;
            if (successMsg !== false && successMsgInStore !== false) {
              let msg: React.ReactNode =
                successMsg || successMsgInStore || i18n('common.op.success', '操作成功');
              if (typeof msg === 'function') {
                msg = msg(response);
              }
              EventCenter.emit('common.async.message', { type: 'success', message: msg });
            }
            return false;
          }
          return true;
        })
      };
    },
    [ASYNC_FAILED]: (
      state: IInitialState,
      action: Utils.ActionWithPayload<AsyncStatus>
    ): IInitialState => {
      const { ASYNC_ID: id, response, errorMsg } = action.payload;
      return {
        ...state,
        asyncStatus: state.asyncStatus.filter(status => {
          if (status.ASYNC_ID === id) {
            if (response) {
              const { errorMsg: errorMsgInStore } = status;
              const { message } = response;
              if (errorMsg !== false && errorMsgInStore !== false) {
                let msg: React.ReactNode =
                  errorMsg || (typeof message === 'object' && message) ? message.message : message;
                if (typeof msg === 'function') {
                  msg = msg(response);
                }
                EventCenter.emit('common.async.message', { type: 'error', message: msg });
              }
            }
            return false;
          }
          return true;
        })
      };
    }
  },
  pureAsyncState
);
