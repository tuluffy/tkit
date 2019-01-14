import * as React from 'react';
import { Modal as AntModal } from 'antd';

import { ModalProps, ModalFunc, ModalFuncProps } from 'antd/es/modal/Modal.d';

import { getContainer } from './Message';

import './Modal.less';

// own props
export interface IModalProps extends ModalProps {}

// own state
export interface IModalState {}

type Props = IModalProps;

const defaultProps: ModalProps = {
  getContainer,
  width: 406,
  maskClosable: true,
  wrapClassName: 'k-common-modal'
};

export default class Modal extends React.PureComponent<Props, IModalState> {
  public static defaultProps = defaultProps;
  public static info: ModalFunc;
  public static success: ModalFunc;
  public static error: ModalFunc;
  public static warn: ModalFunc;
  public static warning: ModalFunc;
  public static confirm: ModalFunc;

  public render() {
    return <AntModal {...this.props} />;
  }
}

['info', 'success', 'error', 'warning', 'warn', 'confirm'].forEach(method => {
  Modal[method] = (props: ModalFuncProps) =>
    AntModal[method]({
      ...defaultProps,
      ...props,
      className: `${defaultProps.wrapClassName}${props.className ? ` ${props.className}` : ''}`
    });
});
