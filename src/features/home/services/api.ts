// import { normalize, schema  } from 'normalizr';

import { ajax } from '@src/utils';

export const defaultJobListParams: Home.ListParams = {
  pageNum: 1,
  pageSize: 10
};

export class JobsAPI {
  public async testList(params: Home.ListParams) {
    return {
      code: 0,
      result: {
        list: [
          { id: 1, name: 'nihao 1' },
          { id: 2, name: 'nihao 2' },
          { id: 3, name: 'nihao 3' },
          { id: 4, name: 'nihao 4' }
        ] as Home.ItemInfo[]
      }
    };
    // return ajax.get('/api/is/recruit/v1/positions/simple', { ...defaultJobListParams, ...params });
  }
}

export const api = new JobsAPI();
