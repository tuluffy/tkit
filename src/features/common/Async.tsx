import * as React from 'react';
import { Spin } from 'antd';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';

import { IRootState } from '@src/types';
import { Modal, Message, Form, EventWrapper } from './';

import actions from './redux/actions';

import './Async.less';
import { ModalFuncProps } from 'antd/es/modal';
import { IEventWrapperProps } from '@src/features/common/EventWrapper';
import { IAsyncConfirmedParams } from './redux/async';

// own props
export interface IAsyncProps {}

// own state
export interface IAsyncState {}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps & IAsyncProps & IEventWrapperProps;

@EventWrapper
export class Async extends React.Component<Props, IAsyncState> {
  public componentDidMount() {
    this.props.on('common.async.message', (info: { type: string; message: React.ReactNode }) => {
      (Message[info.type] || Message.success)(undefined, info.message);
    });
    this.showModal(this.props);
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.asyncStatus !== this.props.asyncStatus) {
      this.showModal(this.props, prevProps.asyncStatus);
    }
  }

  public showModal = (props: Props, prevAsyncStatus?: Props['asyncStatus']) => {
    const { asyncStatus } = props;
    asyncStatus.forEach(status => {
      const { ASYNC_ID } = status;
      const lastStatus = prevAsyncStatus
        ? prevAsyncStatus.find(({ ASYNC_ID: id }) => {
            return id === ASYNC_ID;
          })
        : undefined;
      if (lastStatus !== status) {
        const { confirmed, modalProps = {}, formProps, callback: oldCallback } = status;
        if (confirmed === false) {
          let form: Form | null;
          const newProps = formProps
            ? ({
                ...modalProps,
                className: `k-async-modal ${modalProps ? modalProps.className : ''}`,
                content: (
                  <Form
                    noformProps={{ inline: true }}
                    {...formProps}
                    getForm={f => {
                      form = f;
                    }}
                  />
                ),
                onOk: async () => {
                  let values: any;
                  if (form) {
                    values = await form.submit();
                  }
                  return values;
                }
              } as ModalFuncProps)
            : modalProps;
          if (newProps) {
            const { onCancel, onOk } = newProps;
            // 可能需要再完善
            newProps.onCancel = async () => {
              if (onCancel) {
                await onCancel();
              }
              this.props.actions.doAsyncCancel(ASYNC_ID || -1);
            };
            newProps.onOk = async () => {
              let callback: any;
              let extraParams: any = {};
              if (onOk) {
                extraParams = await onOk();
              }
              const prom = new Promise((rs, rj) => {
                callback = (res: any) => {
                  if (oldCallback) {
                    oldCallback(res);
                  }
                  if (res && res.code) {
                    rj(res);
                  } else {
                    rs(res);
                  }
                };
              });
              this.props.actions.doAsyncConfirmed({
                ...status,
                extraParams, // 外部调用，不允许传递 extraParams
                callback
              } as IAsyncConfirmedParams<any>);
              return prom;
            };
            Modal.confirm(newProps);
          }
        }
      }
    });
  };

  public render() {
    return this.props.asyncStatus.find(({ isFetch }) => !!isFetch) ? (
      <Spin size="large" className="k-common-async k-common-spin" />
    ) : null;
  }
}

/* istanbul ignore next */
function mapStateToProps(state: IRootState, ownProps: IAsyncProps) {
  return {
    asyncStatus: state.common.asyncStatus
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch: Dispatch, ownProps: IAsyncProps) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect<StateProps, DispatchProps, IAsyncProps>(
  mapStateToProps,
  mapDispatchToProps
)(Async as React.ComponentClass<{}>);
