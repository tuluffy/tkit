import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { Row, Col } from 'antd';

import actions from './redux/actions';

import './DefaultPage.less';

export class DefaultPage extends React.Component {
  public render() {
    return (
      <div className="home-default-page">
        <Row className="dashborad-row">
          <Col span={11}>1</Col>
          <Col span={2} />
          <Col span={11}>2</Col>
        </Row>
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state: any) {
  return {
    home: state.home
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch: Dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DefaultPage);
