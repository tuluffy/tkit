import commonActions from '@features/common/redux/actions';
import { doTestList, doSelectTestList } from './testList';

const actions = {
  doTestList,
  doSelectTestList,
  ...commonActions
};

export default actions;
