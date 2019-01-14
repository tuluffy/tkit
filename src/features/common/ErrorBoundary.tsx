import * as React from 'react';

import SFCErrorInfo from './SFCErrorInfo';

// own props
export interface IErrorBoundaryProps {
  children?: React.ReactNode;
  ErrorPresenter?: React.ComponentClass<IErrorBoundaryState> | React.SFC<IErrorBoundaryState>;
}

// own state
export interface IErrorBoundaryState {
  error: boolean;
  message?: React.ReactNode;
}

type Props = IErrorBoundaryProps;

export default class ErrorBoundary extends React.Component<Props, IErrorBoundaryState> {
  public state = {
    error: false,
    message: null
  };

  public componentDidCatch(error: Error, info: any) {
    console.warn(error, info);
    this.setState({
      error: true,
      message: error.message
    });
  }

  public render() {
    const { ErrorPresenter = SFCErrorInfo } = this.props;
    return this.state.error ? <ErrorPresenter {...this.state} /> : this.props.children;
  }
}
