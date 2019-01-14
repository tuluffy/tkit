const loader = (name: string) => async () => {
  const entrance = await import('./');
  return entrance[name];
};

import { IRoute } from '@src/types';

export const childRoutes: IRoute[] = [
  {
    path: 'default-page',
    name: 'Default page',
    load: loader('DefaultPage'),
    isIndex: true
  },
  {
    path: 'test-list',
    name: 'List page',
    load: loader('ListPage')
  }
];

export default {
  path: '/',
  name: 'Home',
  childRoutes
};
