import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { IErrorBoundaryState } from './ErrorBoundary';

export interface ISFCErrorInfoProps extends IErrorBoundaryState {}
type Props = ISFCErrorInfoProps;

export const SFCErrorInfo: React.SFC<Props> = (props: Props) => {
  return (
    <div className="common-presenter common-eror">
      <div className="common-error-title">
        <FormattedMessage id="common.error" defaultMessage="出错了" />
      </div>
      <div className="common-error-content">{props.message || props.error}</div>
    </div>
  );
};

export default SFCErrorInfo;
