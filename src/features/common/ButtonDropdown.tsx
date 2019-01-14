import * as React from 'react';
import { Button, Dropdown, Menu, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { classnames } from '@src/utils';

import { getContainer } from './Message';
import './ButtonDropdown.less';

export interface IButtonDropdownProps {
  menuList: Array<{ title: React.ReactChild; link?: string; action?: any }>;
  title: any;
  icon: any;
  placement:
    | 'topLeft'
    | 'topCenter'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomCenter'
    | 'bottomRight'
    | undefined;
  className?: string;
  type: string;
}
type Props = IButtonDropdownProps;

export const ButtonDropdown: React.SFC<Props> = (props: Props) => {
  const menu = (
    <Menu className="dropdown__menu">
      {props.menuList &&
        props.menuList.map((item, index) => {
          return (
            <Menu.Item key={index} className="dropdown__item">
              {item.link ? (
                item.link.match(/^http/) ? (
                  <a href={item.link}>{item.title}</a>
                ) : (
                  <Link to={item.link}>{item.title}</Link>
                )
              ) : (
                item.title
              )}
            </Menu.Item>
          );
        })}
    </Menu>
  );
  return (
    <Dropdown
      placement={props.placement}
      overlay={menu}
      className={classnames('k-dropdown', props.className)}
      getPopupContainer={getContainer}
    >
      {props.type === 'button' ? (
        <Button type="primary">
          {props.icon}
          {props.title}
        </Button>
      ) : (
        <a className="ant-dropdown-link">
          <span>{props.icon}</span>
          <span>{props.title}</span>
          <Icon type="down" />
        </a>
      )}
    </Dropdown>
  );
};

export default ButtonDropdown;
