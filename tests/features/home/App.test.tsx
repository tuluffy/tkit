import * as React from 'react';
import { shallow, mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMemoryHistory } from 'history';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import configureStore from 'redux-mock-store';
import { App } from '@src/features/home';

const mockStore = configureStore([]);

describe('home/App', () => {
  it('renders node with correct class name', () => {
    const router = (
      <Provider store={mockStore({})}>
        <ConnectedRouter
          history={createMemoryHistory({ initialEntries: ['/home'], initialIndex: 0 })}
        >
          <Route component={App} path="/home" />
        </ConnectedRouter>
      </Provider>
    );
    const renderedComponent = mount(router);

    // why 3 ?
    expect(renderedComponent.find('.home-app').length).toBeGreaterThan(0);
    renderedComponent.unmount();
  });
});
