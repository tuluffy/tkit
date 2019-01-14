import * as Immutabe from 'immutable';
import * as React from 'react';
import { shallow } from 'enzyme';
import configStore from '@src/common/configStore';
import Root from '@src/Root';

describe('Root', () => {
  it('Root has no error', () => {
    const DumpContainer = (props: any) => <div className="container">{props.children}</div>;
    const NotFoundComp = () => <div className="not-found">Not found</div>;
    const routes: any[] = [
      {
        childRoutes: [
          { path: '/', component: DumpContainer, childRoutes: [{ path: 'abc' }] },
          { path: '/root', autoIndexRoute: true },
          { path: 'relative-path', name: 'Link Name' },
          {
            path: 'sub-links',
            childRoutes: [{ path: 'sub-link' }]
          },
          { path: '*', component: NotFoundComp }
        ]
      }
    ];
    const store = configStore({});

    shallow(<Root store={store} routeConfig={routes} />);
  });
});
