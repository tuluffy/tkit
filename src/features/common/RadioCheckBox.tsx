import * as React from 'react';
import { Checkbox } from 'antd';
import { WrapComponentToNoform } from '../common/';
import { getProps, getOmitProps } from '../common/Form';
import { CheckboxProps } from 'antd/es/checkbox/Checkbox.d';

export interface IButtonDropdownProps extends CheckboxProps {}
type Props = IButtonDropdownProps;

export const RadioCheckbox: React.SFC<Props> = (props: Props) => {
  return <Checkbox {...props} />;
};

export const WrappedRadioCheckbox: React.ComponentType<getProps<Checkbox>> = WrapComponentToNoform(
  RadioCheckbox,
  'RadioCheckbox'
);
