import 'isomorphic-fetch';
import * as qs from 'qs';

import { IObject } from '@src/types';

import { EventCenter } from './event';

export type AjaxPromise<R> = Promise<R>;

export interface ExtraFetchParams {
  extra?: any;
}

export interface WrappedFetchParams extends ExtraFetchParams {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'PATCH' | 'HEAD';
  url: string;
  data?: any; // post json
  form?: any; // post form
  query?: any;
  header?: any;
  path?: any;
}

export class WrappedFetch {
  /**
   * @description ajax 方法
   */
  public ajax({ method, url, data, form, query, header, extra }: WrappedFetchParams) {
    let config = {
      credentials: 'include',
      ...extra,
      method,
      headers: { ...header }
    };
    // json
    if (data) {
      config = {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'application/json'
        },
        ...this.ensureJSONData(data)
      };
    }
    // form
    if (form) {
      config = {
        ...config,
        headers: {
          ...config.headers,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        ...this.ensureFormData(form)
      };
    }
    return fetch(this.ensureGetUrl(url, query), config)
      .then(this.checkStatus)
      .then(res => res.json())
      .catch(error => ({
        code: error.code || 10001,
        message: error.message || error
      }));
  }

  /**
   * @description 接口传参校验
   */
  public check(value: any, name: string) {
    if (value === null || value === undefined) {
      const msg = `[ERROR PARAMS]: ${name} can't be null or undefined`;
      // 非生产环境，直接抛出错误
      if (process.env.NODE_ENV === 'development') {
        throw Error(msg);
      }
    }
  }

  public async checkStatus(response: Response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      const err = {
        code: response.status,
        message: response.statusText
      };
      if (response.status === 401 || response.status === 403) {
        EventCenter.emit('common.user.status', err);
      }
      return Promise.reject(err);
    }
  }

  public ensureFormData(data: IObject) {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      formData.append(key, data[key]);
    });
    return {
      body: formData
    };
  }

  public ensureJSONData(data: IObject) {
    return {
      body: JSON.stringify(data)
    };
  }

  public ensureGetUrl = (url: string, data: IObject) => {
    return this.injectQueryToUrl(url, qs.stringify(data));
  };

  public injectQueryToUrl(url: string, query?: string): string {
    if (query) {
      if (url.indexOf('?') === -1) {
        url += '?' + query;
      } else {
        url += '&' + query;
      }
    }
    return url;
  }

  // public objectToQuery(data: IObject): string {
  //   const paramsArray: string[] = [];
  //   Object.keys(data).forEach(key =>
  //     paramsArray.push(
  //       qs.stringify({
  //         [key]: data[key] && typeof data[key] === 'object' ? qs.stringify(data[key]) : data[key]
  //       })
  //     )
  //   );
  //   return paramsArray.join('&');
  // }
}

export default new WrappedFetch();
