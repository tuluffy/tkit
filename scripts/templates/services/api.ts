// import { normalize, schema  } from 'normalizr';

import { ajax } from '@src/utils';

export class ExampleAPI {
  public login(data: any) {
    return ajax.postJSON('/api/common/login', data);
  }

  public logout(data: any) {
    return ajax.postJSON('/api/common/logout', data);
  }
}

export const api = new ExampleAPI();
