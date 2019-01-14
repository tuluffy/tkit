import { pureTestListState } from './testList';

const initialState = {
  ...pureTestListState
};

export type IInitialState = Readonly<typeof initialState>;

export default initialState;
