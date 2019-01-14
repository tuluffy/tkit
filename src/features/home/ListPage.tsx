import * as React from 'react';
import { bindActionCreators, Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import { Table } from 'antd';

import { ColumnProps } from 'antd/es/table/interface.d';
import { IRootState } from '@src/types';
import { parseSearch, searchFy } from '@src/utils/';

import actions from './redux/actions';

import './ListPage.less';

// own props
export interface IListPageProps {}

// own state
export interface IListPageState {}

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = ReturnType<typeof mapDispatchToProps>;

type Props = RouteComponentProps<any> & StateProps & DispatchProps & IListPageProps;

export class ListPage extends React.Component<Props, IListPageState> {
  public columns: Array<ColumnProps<Home.ItemInfo>> = [
    { title: 'id', dataIndex: 'id', render: (id, record) => record.id },
    { title: 'name', dataIndex: 'name', render: (name, record) => record.name }
  ];

  public componentDidMount() {
    const {
      match: { params },
      location: { search }
    } = this.props;
    this.props.actions.doTestList({ ...parseSearch(search), ...params });
  }

  public componentDidUpdate(prevProps: Props) {
    let params: any;
    if (prevProps.match !== this.props.match) {
      params = this.props.match.params;
    }
    if (prevProps.location.search !== this.props.location.search) {
      params = { ...parseSearch(this.props.location.search), ...params };
    }
    if (params) {
      this.props.actions.doTestList(params);
    }
  }

  public onSearchChange = (params: any) => this.props.history.push(searchFy(params));
  public onPageChange = (pageNum: number, pageSize: number) =>
    this.onSearchChange({ ...this.props.testList.params, pageNum, pageSize });

  public render() {
    const { testList } = this.props;
    const { params, pageData, total, loading, fetchError } = testList;
    const { pageSize, current } = params;
    return (
      <div className="k-home-list">
        <Table
          rowKey="id"
          loading={loading}
          dataSource={pageData}
          columns={this.columns}
          pagination={{
            pageSize,
            current,
            total,
            onChange: this.onPageChange
          }}
        />
      </div>
    );
  }
}

/* istanbul ignore next */
function mapStateToProps(state: IRootState, ownProps: IListPageProps) {
  return {
    testList: state.home.testList
  };
}

/* istanbul ignore next */
function mapDispatchToProps(dispatch: Dispatch, ownProps: IListPageProps) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect<StateProps, DispatchProps, IListPageProps>(
  mapStateToProps,
  mapDispatchToProps
)(ListPage);
