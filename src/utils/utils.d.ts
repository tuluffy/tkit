declare namespace Utils {
  interface PagenationParams {
    // 标准参数
    current: number;
    pageNum: number;
    pageSize: number;
    // 非标准参数
    [str: string]: any;
    [num: number]: any;
  }
  interface PagenationStateBase<P> {
    pageData: P[];
    total: number;
    rowKey?: string | number;
    selectedRowKeys: (string | number)[];
    loading: boolean; //  for antd
    isfetch: boolean;
    fetchError:
      | boolean
      | {
          code: number;
          message: any;
        };
    params: PagenationParams;
  }
  interface AbstractBasicResult<R> {
    code: number;
    message?: React.ReactNode;
    result?: R;
  }
  type BasicResult = AbstractBasicResult<any>;
  type BasicFun = (...args: any[]) => any;
  type BasicAsyncFunction = AbstractAsyncFunction<BasicResult>;
  type AbstractAsyncFunction<R> = (...args: any[]) => Promise<R>;
  type GetReturnTypeOfFun<E> = E extends BasicFun ? ReturnType<E> : never;
  type GetReturnTypeOfAsyncFun<E> = GetPromiseResolved<GetReturnTypeOfFun<E>>;
  type GetArgumentsType<T> = T extends (...args: infer A) => any ? A : never;
  type GetArgumentsTypeExcept1st<T> = T extends (a: any, ...args: infer A) => any ? A : never;
  type GetPromiseResolved<R> = R extends Promise<infer P> ? P : R;
  type ActionWithPayload<P> = {
    type: string;
    payload: P;
  };
}
