import 'isomorphic-fetch';
import * as qs from 'qs';

import { IObject } from '@src/types';

import { EventCenter } from './event';

export interface IBaseResponse<R> {
  result: R;
  code: null | number;
  message: string | null;
  success: boolean;
}

export class WrappedFetch {
  public getConfig: RequestInit = {
    method: 'GET',
    mode: 'cors',
    cache: 'default',
    credentials: 'include',
    headers: {
      Accept: 'application/json'
    }
  };

  public postConfig: RequestInit = {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json'
    }
  };

  public postJSONConfig: RequestInit = {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };

  public downLoadConfig: RequestInit = {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  public putJSONConfig: RequestInit = {
    method: 'PUT',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };

  public deleteConfig: RequestInit = {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };

  public get = (url: string, data?: IObject, type?: string) => {
    if (data) {
      url = this.ensureGetUrl(url, data);
    }
    return this.base(url, this.getConfig, type);
  };

  public post = (url: string, data: IObject, type?: string) => {
    return this.base(
      url,
      {
        ...this.postConfig,
        ...this.ensureFormData(data)
      },
      type
    );
  };

  public postJSON = (url: string, data: IObject, type?: string) => {
    return this.base(
      url,
      {
        ...this.postJSONConfig,
        ...this.ensureJSONData(data)
      },
      type
    );
  };
  public downLoad = (url: string, data: IObject, type?: string) => {
    return this.downloadBase(
      url,
      {
        ...this.downLoadConfig,
        ...this.ensureJSONData(data)
      },
      type
    );
  };

  public putJSON = (url: string, data: IObject, type?: string) => {
    return this.base(
      url,
      {
        ...this.putJSONConfig,
        ...this.ensureJSONData(data)
      },
      type
    );
  };

  public sendDelete = (url: string, data: IObject, type?: string) => {
    if (data) {
      url = this.ensureGetUrl(url, data);
    }
    return this.base(url, this.deleteConfig, type);
  };

  public base(url: string, config?: RequestInit, type?: string) {
    const raw = type === 'raw';
    return fetch(
      url + (url.indexOf('?') !== -1 ? '&' + location.search.replace(/\?/g, '') : location.search),
      config
    )
      .then(this.checkStatus)
      .then(res => {
        return raw ? res.text() : res.json();
      })
      .catch(error => ({
        code: error.code || 10001,
        message: error.message || error
      }));
  }

  public downloadBase(url: string, config?: RequestInit, type?: string) {
    return fetch(
      url + (url.indexOf('?') !== -1 ? '&' + location.search.replace(/\?/g, '') : location.search),
      config
    )
      .then(this.checkStatus)
      .then(res => {
        const contentType = res.headers.get('content-type');
        return contentType && contentType.match('json')
          ? res.json().then(json => Promise.reject(json))
          : res.blob().then(blob => {
              // blob用来创建URL的File对象
              const a = document.createElement('a');
              // createObjectURL将一个媒体元素的src属性关联到一个 MediaSource 对象
              const url = window.URL.createObjectURL(blob);
              const cd = res.headers.get('content-disposition') || '';
              const filename = cd.split('=')[1];
              a.href = url;
              a.download = filename;
              a.click();
              // revokeObjectURL使这个潜在的对象保留在原来的地方，允许平台在合适的时机进行垃圾收集。
              window.URL.revokeObjectURL(url);
              return { code: 0 };
            });
      })
      .catch(error => ({
        code: error.code || 10001,
        message: error.message || error
      }));
  }

  public checkStatus(response: Response) {
    if (response.status >= 200 && response.status < 300) {
      return Promise.resolve(response);
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
}

export const ajax = new WrappedFetch();
