/**
 * @description noform 对 ts 不够友好，所以暂且不考虑，还是基于 Form 封装
 */
import * as React from 'react';
import { Input, Select, Button } from 'antd';
// @ts-ignore
import * as Noform from 'noform';
// @ts-ignore
import antdWrapper from 'noform/lib/wrapper/antd';
// @ts-ignore
import noformRepeater from 'noform/lib/repeater/antd';
// @ts-ignore
import CoreForm from 'noform/lib/core/form';
// @ts-ignore
import scroll from 'noform/lib/util/scroll';
// @ts-ignore
import Schema from 'async-validator';
// @ts-ignore
import dialogWrapper from 'noform/lib/dialog/antd';
const Dialog = dialogWrapper({ Modal, Button });

// 劫持 Schema messages
if (LocalDataMessages.locale === 'zh') {
  Schema.prototype.messages = function(messages: any) {
    this._messages = {
      ...Schema.messages,
      ...LocalDataMessages.messages.validator,
      ...messages,
      types: {
        ...(LocalDataMessages.messages.validator && LocalDataMessages.messages.validator.types)
      }
    };
    return this._messages;
  };
}

import { ModalFuncProps } from 'antd/es/modal/Modal.d';
import Modal from './Modal';

import './Form.less';
import { Omit } from 'lodash';

export type AsyncHandler = () => Promise<
  boolean | { success: boolean; values?: any[]; item?: any }
>;

export interface IAsyncHandler {
  add?: AsyncHandler;
  update?: AsyncHandler;
  save?: AsyncHandler;
  remove?: AsyncHandler;
}

export type ValidateType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'method'
  | 'regexp'
  | 'integer'
  | 'float'
  | 'array'
  | 'object'
  | 'enum'
  | 'date'
  | 'url'
  | 'hex'
  | 'email'
  | 'null';
export type ValidateConfig =
  | Array<IValidateItemConfig<ValidateType>>
  | {
      [name: string]:
        | IValidateItemConfig<ValidateType>
        | Array<IValidateItemConfig<ValidateType>>
        | ((values: any, context: any) => any);
    };

export interface IValidateItemConfig<T extends ValidateType> {
  type?: T | T[];
  required?: boolean;
  transform?: (v: any) => any;
  validator?: (
    rule: IValidateItemConfig<T>,
    value: any,
    callback: (error?: any) => any,
    source: any,
    options: any
  ) => any;
  min?: number;
  max?: number;
  pattern?: RegExp;
  range?: [number, number];
  len?: number;
  enum?: any[];
  whitespace?: boolean; // whitespace && required
  fields?: T extends 'object' | 'array'
    ? {
        // only if type is object or array
        [name: string]: IValidateItemConfig<T>;
      }
    : never;
  defaultField?: T extends 'object' | 'array'
    ? {
        // only if type is object or array, validating all values of the container
        [name: string]: IValidateItemConfig<T>;
      }
    : never;
  message?: any;
}
export interface IcustomProps {
  className?: string;
  title?: string;
  content?: any;
  footer?: any;
}
export interface IInlineRepeaterProps {
  // show props
  hasAdd?: boolean;
  hasUpdate?: boolean;
  hasDelete?: boolean;
  hasHeader?: boolean;
  hasDeleteConfirm?: boolean;
  addPosition?: 'top' | 'bottom';
  // setting
  multiple?: boolean;
  maxLength?: number;
  itemAlign?: 'left' | 'center' | 'right';
  // text props
  addText?: string;
  updateText?: string;
  saveText?: string;
  cancelText?: string;
  deleteText?: string;
  operateText?: string;
  filter?: any;
  validateConfig?: ValidateConfig;
  // hooks
  asyncHandler?: IAsyncHandler;
  dialogConfig?: {
    custom: (core: IFormCore, type: 'add' | 'remove' | 'delete', props: any) => IcustomProps;
  };
}

export interface ITableRepeaterProps extends IInlineRepeaterProps {}

export interface ISelectTableRepeaterProps extends ITableRepeaterProps {
  selectKey?: any;
  selectMode?: 'single' | 'multiple';
}

export type ITableRepeater = React.ComponentClass<ITableRepeaterProps>;
export type ISelectTableRepeater = React.ComponentClass<ISelectTableRepeaterProps>;
export type IInlineRepeater = React.ComponentClass<IInlineRepeaterProps>;

export type Repeater = <A extends React.ComponentClass>(
  components: { [name: string]: A }
) => {
  TableRepeater: ITableRepeater;
  InlineRepeater: IInlineRepeater;
  SelectTableRepeater: ISelectTableRepeater;
};

export type Status = 'edit' | 'preview' | 'disabled';
export type SetStatusCase1 = (name: string, status: Status) => void;
export type SetStatusCase2 = (name: { [key: string]: Status }) => void;
export type SetErrorCase1 = (name: string, status: any) => void;
export type SetErrorCase2 = (name: { [key: string]: any }) => void;
export interface IFormCore extends Noform.FormCore {
  on: (
    event: 'change' | string,
    handler: (changeKeys: string[], value: { [name: string]: any }, core: IFormCore) => any
  ) => void;
  // status
  getGlobalStatus: () => Status;
  setGlobalStatus: (Status: Status) => void;
  getStatus: <N>(name?: N) => N extends string ? any : { [name: string]: any };
  setStatus: SetStatusCase1 & SetStatusCase2;
  // value
  getValue: (name: string) => any;
  getValues: () => { [name: string]: any };
  setValue: (name: string, value: any) => void;
  setValues: (values: { [name: string]: any }) => void;
  // props
  getProps: (name: string) => { [name: string]: any };
  setProps: <P>(name: string, props: P) => void;
  // error
  getError: <N>(name?: N) => N extends string ? any : { [name: string]: any };
  setError: SetErrorCase1 & SetErrorCase2;
  // validate
  validate: () => Promise<any>;
  validateWithoutRender: () => Promise<any>;
  validateItem: (keys: string[]) => Promise<any>;
  reset: (values?: { [name: string]: any }) => any;
  [extraProps: string]: any;
  scrollToError: () => any;
}

export interface IFormItemProps extends React.Props<any> {
  label?: any;
  name?: string;
  prefix?: React.ReactChild;
  suffix?: React.ReactChild;
  top?: React.ReactChild;
  help?: React.ReactChild;
  error?: React.ReactChild;
  required?: boolean;
  status?: ((values: any, core: any) => Status) | Status;
  render?: (values: any, core: IFormCore) => any;
  props?: (props: any, core: IFormCore) => Omit<IFormItemProps, 'render' & 'props'>;
  layout?: {
    label: number;
    control: number;
  };
  [extraProps: string]: any; // in case of any thing missed
  value?: never; // forbidden
  onChange?: never; // forbidden
  defaultValue?: any;
  errorRender?: (errMsg: any, error: any) => React.ReactChild;
  validateConfig?:
    | IValidateItemConfig<ValidateType>
    | Array<IValidateItemConfig<ValidateType>>
    | ((values: any, context: any) => any);
  className?: string;
}

export interface IItemProps extends React.Props<{}> {
  label?: any;
  name: string;
  render?: (values: any, core: IFormCore) => any;
  props?: (props: any, core: IFormCore) => Omit<IItemProps, 'render' & 'props'>;
  layout?: {
    label: number;
    control: number;
  };
  [extraProps: string]: any; // in case of any thing missed
}
export interface IIfProps extends React.Props<{}> {
  when: (values: any, core: IFormCore) => boolean;
}

export const repeater: Repeater = noformRepeater;
export const { TableRepeater, InlineRepeater, SelectTableRepeater } = repeater({ Dialog });
export const FormItem: React.ComponentClass<IFormItemProps> = Noform.FormItem;
export const Item: React.ComponentClass<IItemProps> = Noform.Item;
export const If: React.ComponentClass<IIfProps> = Noform.If;

export const IIfProps = Noform.If;

export interface IWrappedItemProps {
  status?: Status;
  onChange?: never;
  value?: never;
}

export type getProps<C> = IWrappedItemProps &
  (C extends React.Component<infer P>
    ? P
    : C extends React.SFC<infer P>
    ? P
    : C extends React.ComponentType<infer P>
    ? P
    : {});
export type getOmitProps<C> = Omit<getProps<C>, 'onChange' & 'value' & 'defaultValue'> & {
  onChange?: never;
  value?: never;
  defaultValue?: never;
};

export function WrapComponentToNoform<C>(component: C, name: string = 'Cp') {
  const { [name]: Cp } = antdWrapper({ [name]: component });
  return Cp as React.ComponentType<getOmitProps<C>>;
}

export function WrapComponentsToNoform(components: any[]) {
  return components.map((component, index) => WrapComponentToNoform(component, `Cp${index}`));
}

export type WrappedSelectOptions = Array<{ label: any; value: any }>;
export const WrappedInput: React.ComponentType<getOmitProps<Input>> = WrapComponentToNoform(
  Input,
  'Input'
);
export const WrappedSelect: React.ComponentType<
  getOmitProps<Select> & { options?: WrappedSelectOptions }
> = WrapComponentToNoform(Select, 'Select');

export interface IFormRenderProps {
  form: Form;
  noformProps?: IFormProps['noformProps'];
  [props: string]: any;
}

// own props
export interface IFormProps {
  Render?: React.ComponentClass<IFormRenderProps> | React.SFC<IFormRenderProps>;
  getForm?: (form: Form) => void;
  children?: any;
  className?: string;
  noformProps?: {
    defaultMinWidth?: boolean;
    colon?: boolean;
    full?: boolean;
    inline?: boolean;
    inset?: boolean;
    layout?: {
      label: number;
      control: number;
    };
    validateConfig?: ValidateConfig;
    direction?: 'vertical' | 'horizontal';
    style?: {};
    className?: any;
    value?: any;
    // status?: Status | { [name: string]: any }
    onFocus?: (name: string) => void;
    onBlur?: (name: string) => void;
    onMount?: (core: IFormCore) => void;
    onChange?: (values: any, keys: string[], core: IFormCore) => void;
    map?: (v: any) => any;
    // some missing props ?
  };
  nofromCoreProps?: {
    autoValidate?: boolean;
    values?: { [name: string]: any };
    status?: { [name: string]: Status };
    globalStatus?: Status;
    onChange?: (changeKeys: string[], value: { [name: string]: any }, core: IFormCore) => any;
    validateConfig?: ValidateConfig;
    interceptor?: { [name: string]: <V>(v: V) => Promise<V> | V };
  };
}

// own state
export interface IFormState {}

type Props = IFormProps;

export interface IFormFuncProps {
  modalProps?: ModalFuncProps;
  formProps: IFormProps;
}

export default class Form extends React.Component<Props, IFormState> {
  public static confirm: (props: IFormFuncProps) => Promise<any>;
  public static defaultProps: Props = {
    Render: () => null
  };
  public core: IFormCore;
  public containerId: string = `__tform__${Date.now()}__${
    Math.random()
      .toFixed(8)
      .split('.')[1]
  }`;

  public constructor(props: Props) {
    super(props);
    const core = (this.core = new Noform.FormCore({
      autoValidate: true,
      ...props.nofromCoreProps
    }));
    // 猥琐的处理国际化问题
    const lastHandleErrors = this.core.handleErrors;
    const lastSetError = this.core.setError;
    this.core.handleErrors = function handleErrors(withRender: boolean, errs: any) {
      if (Array.isArray(core.children) && Array.isArray(errs)) {
        core.children.forEach(
          // { name, jsx } // 可通过 jsx 拿到表单
          ({ name }: any, index: number) => {
            const e = errs[index];
            if (typeof e === 'string') {
              errs[index] = e
                .replace(name, '')
                .replace(/ (number|email|string|url)/g, '')
                .trim();
            }
          }
        );
      } else {
        console.warn('劫持 noform handleErrors 可能失败了，请排查');
      }
      return lastHandleErrors.call(this, withRender, errs);
    };
    this.core.setError = function setError(...args: any[]) {
      const errs = args[args.length - 1];
      if (errs) {
        Object.keys(errs).forEach((name: string) => {
          if (typeof errs[name] === 'string') {
            errs[name] = errs[name]
              .replace(name, '')
              .replace(/ (number|email|string|url)/g, '')
              .trim();
          }
        });
      }
      lastSetError.apply(this, args);
    };
  }

  public componentWillUnmount() {
    delete this.core;
  }

  public async validate(): Promise<any> {
    return await this.core.validate();
  }

  public async submit(): Promise<any> {
    const errors = await this.validate();
    // @todo 猥琐的修复 noform/lib/core/form.js scrollToError 不生效问题
    if (errors && this.core) {
      try {
        scroll(`#${this.containerId} [name=form-item-${Object.keys(errors)[0]}]`);
      } catch (e) {
        console.warn(e);
      }
    }
    return errors ? Promise.reject(errors) : Promise.resolve(this.core.getValues());
  }

  public setStatus(status: Status) {
    this.core.setGlobalStatus(status);
  }

  public render() {
    if (this.props.getForm) {
      this.props.getForm(this);
    }
    return (
      <div
        id={this.containerId}
        className={`k-common-form${this.props.className ? ` ${this.props.className}` : ''}`}
      >
        <Noform.default {...this.props.noformProps} core={this.core}>
          {this.props.Render ? (
            <this.props.Render form={this} noformProps={this.props.noformProps} />
          ) : null}
          {this.props.children}
        </Noform.default>
      </div>
    );
  }
}

Form.confirm = ({ modalProps = {}, formProps }: IFormFuncProps) =>
  new Promise((rs, rj) => {
    const { onOk, onCancel } = modalProps;
    let form: any;
    async function newOnOk(close: () => void) {
      if (form) {
        const values = await form.submit();
        const res = onOk ? await onOk(values) : values;
        return rs(res);
      }
      return rj('no form found');
    }
    async function newOnCancle(info: any) {
      const res = onCancel ? await onCancel(info) : info;
      return rj(res);
    }
    Modal.confirm({
      ...modalProps,
      content: (
        <Form
          {...formProps}
          ref={inst => {
            form = inst;
          }}
        />
      ),
      onOk: newOnOk,
      onCancel: newOnCancle
    });
  });
