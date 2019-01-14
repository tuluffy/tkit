import * as qs from 'qs';

export const parseSearch = (search: string) => qs.parse(search.trim().replace(/^[\?]+/g, ''));
export const searchFy = (params: any) => `?${qs.stringify(params)}`;
