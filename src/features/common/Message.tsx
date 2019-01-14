import * as React from 'react';
import { Icon, message } from 'antd';

import './Message.less';

let y = 24;

if (typeof window !== 'undefined') {
  const size = () => {
    y =
      (document.body.clientHeight ||
        (document.documentElement && document.documentElement.clientHeight) ||
        0) /
        2 -
      188 / 2;
  };
  window.addEventListener('resize', size);
  size();
}

export const getContainer = () => {
  let ele = document.querySelector('.k-common-layer') as HTMLElement;
  if (!ele) {
    ele = document.createElement('div');
    ele.className = 'k-common-layer';
    document.body.appendChild(ele);
  }
  return ele;
};

export type TitleOrContent = React.ReactNode | string;

const wrapper = (type: string) => (
  title: TitleOrContent,
  content?: TitleOrContent,
  duration: number = 1
) => {
  message.config({
    getContainer,
    maxCount: 1,
    top: y
  });
  const onClick = () => message.destroy();
  onClick();
  return message[type](
    <div className="k-common-message">
      <Icon type="close" theme="outlined" className="k-common-closable" onClick={onClick} />
      <div className="k-common-message-title">{title}</div>
      <div className="k-common-message-content">{content}</div>
    </div>,
    duration
  );
};

const MessageAPI = {
  error: wrapper('error'),
  info: wrapper('info'),
  loading: wrapper('loading'),
  success: wrapper('success'),
  warn: wrapper('warn')
};

export default MessageAPI;
