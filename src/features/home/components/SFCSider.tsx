import { Menu } from 'antd';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';

import { IRootState } from '@src/types';

import './SFCSider.less';

export interface ISFCSiderProps {
  pathname: string[] | null;
}

interface ISiderMenuConfig {
  name: string | React.ReactNode;
  icon: string;
  path: string;
  defaultPath?: string;
}

type StateProps = ReturnType<typeof mapStateToProps>;
type Props = StateProps & ISFCSiderProps;

export const SFCSider: React.SFC<Props> = (props: Props) => {
  const { pathname } = props;
  let execPath: string = '';
  const siderMenu: ISiderMenuConfig[] = [
    { name: <FormattedMessage id="home_viewAll" />, icon: `kiconfont k-icon-dashboard`, path: '/' }
  ];

  if (pathname) {
    siderMenu.forEach(({ defaultPath }) => {
      if (defaultPath && defaultPath.indexOf(pathname[0]) !== -1) {
        if (!execPath) {
          execPath = defaultPath;
        }
        if (defaultPath.indexOf(pathname.slice(0, 2).join('/')) === 1) {
          execPath = defaultPath;
        }
      }
    });
  } else {
    execPath = '/';
  }

  return (
    <div className="k-sider">
      <div className="logo" />
      <Menu
        theme="light"
        defaultSelectedKeys={[execPath]}
        mode="inline"
        className="menu-list"
        selectedKeys={[execPath]}
      >
        {siderMenu.map(item => (
          <Menu.Item key={item.defaultPath || item.path}>
            <Link to={item.defaultPath || item.path}>
              <span className={item.icon} />
              <span className="title">{item.name}</span>
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    </div>
  );
};
/* istanbul ignore next */
function mapStateToProps(state: IRootState, ownProps: ISFCSiderProps) {
  return {};
}

export default connect<StateProps, any, ISFCSiderProps>(mapStateToProps)(SFCSider);
