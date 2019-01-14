import * as React from 'react';
import {
  DatePicker,
  Switch,
  TimePicker,
  Upload,
  Checkbox,
  Input,
  Radio,
  InputNumber,
  TreeSelect
} from 'antd';
import { DatePickerProps } from 'antd/es/date-picker/interface.d';
import { TimePickerProps } from 'antd/es/time-picker/index.d';
import { UploadProps } from 'antd/es/upload/index.d';
import { RadioProps } from 'antd/es/radio/index.d';
import { InputNumberProps } from 'antd/es/input-number/index.d';
import { TreeSelectProps } from 'antd/es/tree-select/index.d';
const Dragger = Upload.Dragger;
const RadioGroup = Radio.Group;
import {
  WrapComponentToNoform,
  Editor,
  CheckableTag,
  WrappedSelect as S,
  WrappedInput as I
} from '../common';

import { getOmitProps } from '../common/Form';
const { TextArea } = Input;
export const WrappedDatePicker: React.ComponentType<
  getOmitProps<any> & DatePickerProps
> = WrapComponentToNoform(
  (props: any) => <DatePicker locale={LocalDataMessages.antd.DatePicker} {...props} />,
  'DatePicker'
);
export const WrappedTimePicker: React.ComponentType<
  getOmitProps<any> & TimePickerProps
> = WrapComponentToNoform(
  (props: any) => <TimePicker locale={LocalDataMessages.antd.TimePicker} {...props} />,
  'TimePicker'
);
export const WrappedRadio: React.ComponentType<
  getOmitProps<any> & RadioProps
> = WrapComponentToNoform(Radio, 'Radio');
export const WrappedRadioGroup: React.ComponentType<
  getOmitProps<any> & RadioProps
> = WrapComponentToNoform(RadioGroup, 'Radio');
export const WrappedInputNumber: React.ComponentType<
  getOmitProps<any> & InputNumberProps
> = WrapComponentToNoform(InputNumber, 'InputNumber');
export const WrappedTreeSelect: React.ComponentType<
  getOmitProps<any> & TreeSelectProps
> = WrapComponentToNoform(TreeSelect, 'TreeSelect');
export const WrappedEditor: React.ComponentType<getOmitProps<Editor>> = WrapComponentToNoform(
  Editor,
  'Editor'
);
export const WrappedUpload: React.ComponentType<
  getOmitProps<any> & UploadProps
> = WrapComponentToNoform(Upload, 'Upload');
export const WrappedDragger: React.ComponentType<
  getOmitProps<any> & UploadProps
> = WrapComponentToNoform(Dragger, 'Dragger');
export const WrappedCheckableTag: React.ComponentType<
  getOmitProps<CheckableTag>
> = WrapComponentToNoform(CheckableTag, 'CheckableTag');
export const WrappedSwitch: React.ComponentType<getOmitProps<Switch>> = WrapComponentToNoform(
  Switch,
  'Switch'
);
export const WrappedCheckbox: React.ComponentType<getOmitProps<Checkbox>> = WrapComponentToNoform(
  Checkbox,
  'Checkbox'
);
export const WrappedTextArea: React.ComponentType<
  getOmitProps<typeof TextArea>
> = WrapComponentToNoform(TextArea, 'TextArea');
export const WrappedSelect = S;
export const WrappedInput = I;
