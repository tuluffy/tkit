import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Breadcrumb as AB } from 'antd';

import { IRootState } from '@src/types';

import actions from './redux/actions';

import './Breadcrumb.less';

// own props
export interface IBreadcrumbProps {}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

type Props = StateProps & DispatchProps & IBreadcrumbProps;

export class Breadcrumb extends React.PureComponent<Props> {
  public render() {
    return (
      <div
        className={`k-common-breadcrumb hidden ${this.props.breadcrumbs.length ? '' : 'hidden'}`}
      >
        <AB routes={this.props.breadcrumbs} />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state: IRootState, ownProps: IBreadcrumbProps) {
  return {
    breadcrumbs: state.common.breadcrumbs
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch: Dispatch, ownProps: IBreadcrumbProps) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect<StateProps, DispatchProps, IBreadcrumbProps>(
  mapStateToProps,
  mapDispatchToProps
)(Breadcrumb);
