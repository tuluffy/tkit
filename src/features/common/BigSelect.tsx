import 'react-select/dist/react-select.css';
import 'react-virtualized-select/styles.css';
import Select from 'react-virtualized-select';
import * as React from 'react';
import './BigSelect.less';
import { WrapComponentToNoform } from '../common/';
import { getProps, WrappedSelectOptions } from '../common/Form';
import { i18n } from '@src/utils';

export interface IBigSelectProps {
  options?: Array<{ label: any; value: any; [others: string]: any }>;
  placeholder?: string;
  style?: any;
  onChange?: (value: any) => void;
  onFocus?: (value: any) => void;
  value?: any;
  simpleValue?: boolean;
  disabled?: boolean;
  multi?: boolean;
  async?: boolean;
  cacheOptions?: boolean;
  defaultOptions?: boolean;
  loadOptions?: () => Promise<{ data: WrappedSelectOptions }>;
}

type Props = IBigSelectProps;

const BigSelect: React.SFC<Props> = (props: Props) => {
  return (
    <div className="big-select">
      <Select placeholder={i18n('common.select', '选择')} {...props} />
    </div>
  );
};
export default Select;
export const WrappedBigSelect: React.ComponentType<
  getProps<Select> & IBigSelectProps
> = WrapComponentToNoform(BigSelect, 'BigSelect');
