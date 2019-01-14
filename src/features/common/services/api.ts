// import { normalize, schema  } from 'normalizr';

import { ajax } from '@src/utils';
import { IBaseResponse } from '@src/utils/ajax';
import CONFIG from '@src/config';

export class CommonAPI {
  // 上传文件
  public uploadFile = CONFIG.UPLOAD_API;

  // 下载文件
  public downloadFile = CONFIG.DOWND_API;

  // 所有用户
  public userList(params: { name?: string } = {}) {
    return ajax.get(CONFIG.USER_LIST_API, params);
  }

  public userInfo(): Promise<IBaseResponse<Common.CurrentUserInfo>> {
    return ajax.get(CONFIG.USER_INFO_API);
  }
}

export const api = new CommonAPI();
