import { bindActionCreators, Dispatch } from 'redux';
import { createAction, handleActions } from 'redux-actions';
import * as sagaEffects from 'redux-saga/effects';

const { all, put, call } = sagaEffects;

export const effects = sagaEffects;
export const EFFECTS_START = 'EFFECTS_START';
export const EFFECTS_END = 'EFFECTS_END';

export interface Tction<P> {
  payload: P;
}

type AbstractAction = Tction<any>;

export interface Reducers<M> {
  [doSomething: string]:
    | (<P extends never>(state: M, action: P) => M)
    | (<P extends AbstractAction>(state: M, action: P) => M);
}

/**
 * @description 用以替代 redux-saga put 的 typed 的 tPut
 * @param effect model 或者 redux 创建的 action
 * @param args action 支持的参数
 */
export function tPut<E extends (...args: any[]) => any>(
  effect: E,
  ...args: Utils.GetArgumentsType<E>
): any {
  if (typeof effect === 'function') {
    const actions = bindActionCreators({ effect }, (payload: any) => {
      return put({
        type: `${effect}`,
        payload
      }) as any;
    });
    return actions.effect(...args);
  }
}
/**
 * @description 用以替代 redux-saga call 的 typed tCall
 * @param effect effect 函数，如 service
 * @param args effect 函数的参数
 */
export function tCall<E extends (...args: any[]) => any>(
  effect: E,
  ...args: Utils.GetArgumentsType<E>
): ReturnType<typeof call> {
  type A = typeof args;
  // 不可以: call(effect, ...args)
  return call.apply(null, [effect, ...args]);
}
export type CustonEffects = typeof sagaEffects & {
  namespace: string;
  tPut: typeof tPut;
  tCall: typeof tCall;
};

type EffectWithoutPayload = (<P extends never>(saga: CustonEffects, action: P) => any);
type EffectWithPayload = (<P extends AbstractAction>(saga: CustonEffects, action: P) => any);
type EffectType = 'takeEvery' | 'takeLatest' | 'throttle' | 'watcher';
interface EffectOptions {
  type: EffectType;
  ms?: number;
}
export type MixWithoutPayload = [EffectWithoutPayload, EffectOptions];
export type MixWithPayload = [EffectWithPayload, EffectOptions];
export interface Effects {
  [doSomethingAsync: string]:
    | MixWithoutPayload
    | MixWithPayload
    | EffectWithoutPayload
    | EffectWithPayload;
}

const defaultEffectOptions: EffectOptions = {
  type: 'takeEvery',
  ms: 100
};

// effects dependences
export type Sagas = Array<(...args: any[]) => any>;

export default function createModel<M, R extends Reducers<M>, E extends Effects>(model: {
  namespace: string;
  state: M;
  reducers: R;
  effects?: E;
}) {
  type ReducerName = keyof R;
  type EffectName = keyof E;
  type ActionName = ReducerName | EffectName;
  type Actions = {
    [doSomething in ActionName]: doSomething extends ReducerName
      ? (Utils.GetArgumentsType<R[doSomething]>[1] extends AbstractAction
          ? (<P extends Utils.GetArgumentsType<R[doSomething]>[1]>(payload: P['payload']) => P)
          : () => any)
      : (doSomething extends EffectName
          ? (Utils.GetArgumentsType<E[doSomething]>[1] extends AbstractAction
              ? (<P extends Utils.GetArgumentsType<E[doSomething]>[1]>(payload: P['payload']) => P)
              : () => any)
          : never)
  };
  const { namespace, state, reducers, effects } = model;
  const reducersMap: any = {};
  const TYPES: any = {};
  let actions = Object.keys(reducers).reduce(
    (actions, doSomething) => {
      type Action = typeof reducers[typeof doSomething];
      type Payload = Utils.GetArgumentsType<Action>[1];
      const type = (TYPES[doSomething] = `${namespace}/${doSomething}`);
      reducersMap[type] = reducers[doSomething];
      actions[doSomething] = createAction(
        type,
        (payload: Payload['payload']) => payload
      ) as Payload extends AbstractAction ? (p: Payload['payload']) => any : () => any;
      return actions;
    },
    {} as Actions
  );
  const genSagas: any[] = [];
  const custonEffects: CustonEffects = { ...sagaEffects, namespace, tPut, tCall };
  if (effects) {
    actions = Object.keys(effects).reduce((actions, doSomethingAsync) => {
      type Action = typeof reducers[typeof doSomethingAsync];
      type Payload = Utils.GetArgumentsType<Action>[1];
      const type = (TYPES[doSomethingAsync] = `${namespace}/${doSomethingAsync}`);
      if (doSomethingAsync in actions) {
        console.error(`[Critical Error]: action '${doSomethingAsync}' already exists!!`);
      } else {
        actions[doSomethingAsync] = createAction(
          type,
          (payload: Payload['payload']) => payload
        ) as Payload extends AbstractAction ? (p: Payload['payload']) => any : () => any;
        let saga = effects[doSomethingAsync];
        let effectOptions = defaultEffectOptions;
        if (Array.isArray(saga)) {
          effectOptions = { ...defaultEffectOptions, ...saga[1] };
          saga = saga[0];
        }
        switch (effectOptions.type) {
          case 'throttle':
            genSagas.push(
              sagaEffects.throttle(effectOptions.ms || 100, type, function* wrapper(
                payload: Payload extends AbstractAction ? Payload['payload'] : never
              ) {
                // @todo: payload as never??
                yield (saga as EffectWithoutPayload)(custonEffects, payload as never);
              })
            );
            break;
          case 'takeEvery':
          case 'takeLatest':
            genSagas.push(
              sagaEffects[effectOptions.type](type, function* wrapper(
                payload: Payload extends AbstractAction ? Payload['payload'] : never
              ) {
                // @todo: payload as never??
                yield (saga as EffectWithoutPayload)(custonEffects, payload as never);
              })
            );
            break;
        }
      }
      return actions;
    }, actions);
  }
  return {
    state,
    actions,
    reducers: handleActions(reducersMap, state),
    *sagas() {
      yield all(genSagas);
    },
    TYPES: TYPES as { [type in ActionName]: string }
  };
}
