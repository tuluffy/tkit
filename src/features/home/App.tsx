import * as React from 'react';
import { Layout, LocaleProvider } from 'antd';
import { SFCHeader, SFCSider, SFCFooter } from './components';
import { IntlProvider, addLocaleData } from 'react-intl';
import { RouteComponentProps } from 'react-router-dom';
import { Breadcrumb, Async, ErrorBoundary } from '@features/common/';
import './App.less';

addLocaleData(LocalDataMessages.lang);

const { Header, Content, Sider, Footer } = Layout;

interface Istate {
  collapsed: boolean;
}
interface Iprops extends RouteComponentProps<any> {}
export default class App extends React.Component<Iprops, Istate> {
  public render() {
    return (
      <IntlProvider locale={LocalDataMessages.locale} messages={LocalDataMessages.messages}>
        <LocaleProvider locale={LocalDataMessages.antd}>
          <Layout style={{ minHeight: '100vh' }} className="home-app">
            <ErrorBoundary>
              <Sider
                theme="light"
                width={186}
                style={{ position: 'fixed', zIndex: 100, height: '100%' }}
              >
                <SFCSider pathname={this.props.location.pathname.match(/\w+/g)} />
              </Sider>
              <Layout>
                <Header className="k-layout-header">
                  <SFCHeader />
                </Header>
                <Content className="k-layout-content">
                  <Breadcrumb />
                  <Async />
                  {this.props.children}
                </Content>
                <Footer>
                  <SFCFooter />
                </Footer>
              </Layout>
            </ErrorBoundary>
          </Layout>
        </LocaleProvider>
      </IntlProvider>
    );
  }
}
