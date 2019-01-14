import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import ButtonDropdown from '@features/common/ButtonDropdown';

import { IRootState } from '@src/types';

import './SFCHeader.less';
import '../DefaultPage.less';

import actions from '../redux/actions';
import history from '@src/common/history';

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

export interface ISFCHeaderProps {}
type Props = StateProps & DispatchProps & ISFCHeaderProps;

const onSeach = (keyword: string) => {
  if (keyword.trim()) {
    history.push(`/candidates/list/search/?s=${keyword.trim()}`);
  }
};

export const SFCHeader: React.SFC<Props> = (props: Props) => {
  const loginList = [{ title: '退出登陆', link: '' }];
  return (
    <div className="header">
      <ButtonDropdown
        className="header__dropdown"
        type="text"
        menuList={loginList}
        title={(props.userInfo && props.userInfo.name) || ''}
        icon={
          <img
            className="header__avatar"
            src={(props.userInfo && props.userInfo.avatar) || require('@src/assets/avatar.png')}
          />
        }
        placement="bottomRight"
      />
    </div>
  );
};

/* istanbul ignore next */
function mapStateToProps(state: IRootState, ownProps: ISFCHeaderProps) {
  return {
    userInfo: state.common.userInfo
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch: Dispatch, ownProps: ISFCHeaderProps) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect<StateProps, DispatchProps, ISFCHeaderProps>(
  mapStateToProps,
  mapDispatchToProps
)(SFCHeader);
