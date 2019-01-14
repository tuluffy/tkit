import { doBreadcrumb } from './breadcrumb';
import {
  doAsync,
  doAsyncError,
  doAsyncCancel,
  doAsyncConfirmed,
  doNewAsync,
  doNewAsyncConfirmed
} from './async';
import { default as doUserModel } from './userModel';

const actions = {
  doBreadcrumb,
  doAsync,
  doAsyncError,
  doAsyncCancel,
  doAsyncConfirmed,
  doNewAsync,
  doNewAsyncConfirmed,
  ...doUserModel.actions
};

export default actions;
