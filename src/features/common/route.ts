const loader = (name: string) => async () => {
  const entrance = await import('./');
  return entrance[name];
};

import { IRoute } from '@src/types';

export const childRoutes: IRoute[] = [
  {
    load: loader('PageNotFound'),
    path: '404',
    name: '404'
  }
];

export default {
  path: 'common',
  name: 'Common',
  childRoutes
};
