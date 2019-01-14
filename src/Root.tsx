import * as React from 'react';
import { Provider } from 'react-redux';
import { Switch, Redirect, Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import Loadable from 'react-loadable';
import history from './common/history';
import { SFCErrorInfo } from './features/common';

import { AyncComponentLoader, IRoute } from '@src/types';

export const LoadableComponent = (loader: AyncComponentLoader) =>
  Loadable({
    loader: () =>
      loader().then(
        res => res,
        e => () => <SFCErrorInfo error message={e && e.message ? e.message : 'opps~'} />
      ),
    loading() {
      return <div className="k-common-loading">loading...</div>;
    }
  });

function renderRouteConfig(routes: IRoute[], contextPath?: string) {
  const children: any[] = [];

  const renderRoute = (item: IRoute, routeContextPath?: string) => {
    let newContextPath: any;
    if (/^\//.test(item.path)) {
      newContextPath = item.path;
    } else {
      newContextPath = `${routeContextPath}/${item.path}`;
    }
    newContextPath = newContextPath.replace(/\/+/g, '/');
    if (item.load) {
      item.component = item.component || LoadableComponent(item.load);
    }
    if (item.redirect) {
      const render = () => (
        <Redirect
          to={item.redirect && item.redirect.match(/\/$/g) ? item.redirect : `${item.redirect}/`}
        />
      );
      children.push(<Route key={newContextPath} path={newContextPath} render={render} />);
    } else if (item.component && item.childRoutes) {
      const childRoutes = renderRouteConfig(item.childRoutes, newContextPath);
      const render = (props: any) =>
        item.component ? <item.component {...props}>{childRoutes}</item.component> : null;
      children.push(<Route key={newContextPath} render={render} path={newContextPath} />);
    } else if (item.component) {
      const render = (props: any) => (item.component ? <item.component {...props} /> : null);
      children.push(<Route key={newContextPath} render={render} path={newContextPath} exact />);
    } else if (item.childRoutes) {
      item.childRoutes.forEach(r => renderRoute(r, newContextPath));
    }
  };

  routes.forEach(item => renderRoute(item, contextPath));

  // Use Switch so that only the first matched route is rendered.
  return <Switch>{children}</Switch>;
}

export interface IRootProps {
  store: any;
  routeConfig: IRoute[];
}

export default class Root extends React.Component<IRootProps> {
  public render() {
    const children = renderRouteConfig(this.props.routeConfig, '/');
    return (
      <Provider store={this.props.store}>
        <ConnectedRouter history={history}>{children}</ConnectedRouter>
      </Provider>
    );
  }
}
