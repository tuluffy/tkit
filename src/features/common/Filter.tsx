import * as React from 'react';
import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';

import Form, {
  WrappedSelectOptions,
  FormItem,
  WrappedInput,
  WrappedSelect,
  IFormItemProps
} from './Form';

import './Filter.less';

// own props
export interface IFilterProps {
  formItems?: IFormConfigItem[];
  optionsMap?: {
    [key: string]: WrappedSelectOptions;
  };
  value?: any;
  inline?: boolean;
  onSubmit?: (values: any) => any;
  replaceClassName?: string;
}

export interface IFormConfigItem {
  name: string;
  label?: string;
  defaultLabel?: string;
  Cp?: React.ComponentType<any>;
  ItemConfig?: IFormItemProps;
  CpConfig?: {
    options?: WrappedSelectOptions;
    [others: string]: any;
  }; // it's hard to get Cp Props dynamic
  computeCpConfig?: ((props: Props, item: IFormConfigItem) => any);
}

type Props = IFilterProps;
export const emptyArr: Readonly<any[]> = [];

export default class Filter extends React.PureComponent<Props> {
  public form: Form | null;
  public buttons = (
    <React.Fragment>
      <Button type="primary" onClick={() => this.submit()}>
        <FormattedMessage id="common.filter.search" defaultMessage="搜索" />
      </Button>
      <Button onClick={() => this.reset()}>
        <FormattedMessage id="common.filter.reset" defaultMessage="清空已选条件" />
      </Button>
    </React.Fragment>
  );
  public reset = () => {
    if (this.form) {
      this.form.core.reset();
    }
  };
  public submit = () => {
    return this.form ? this.form.submit().then(this.props.onSubmit) : null;
  };
  public computeCpConfig = (props: Props, item: any) => ({
    options: (props && props.optionsMap && props.optionsMap[item.name]) || emptyArr
  });
  public Render = () => {
    return (
      <React.Fragment>
        {(Array.isArray(this.props.formItems) ? this.props.formItems : []).map(item => {
          const { name, Cp = WrappedInput, CpConfig, ItemConfig } = item;
          const { defaultLabel = name } = item;
          const { label = defaultLabel } = item;
          let { computeCpConfig } = item;
          const config = {
            label,
            key: name,
            ...ItemConfig,
            name
          };
          if (Cp === WrappedSelect && !computeCpConfig) {
            computeCpConfig = this.computeCpConfig;
          }
          return ItemConfig && ItemConfig.render ? (
            <FormItem {...config} />
          ) : (
            <FormItem {...config}>
              <Cp
                {...CpConfig}
                {...(typeof computeCpConfig === 'function'
                  ? computeCpConfig(this.props, item)
                  : computeCpConfig)}
              />
            </FormItem>
          );
        })}
      </React.Fragment>
    );
  };
  public render() {
    const { replaceClassName } = this.props;
    return (
      <div className={replaceClassName ? replaceClassName : 'k-common-filter'}>
        <Form
          Render={this.Render}
          getForm={f => {
            this.form = f;
          }}
          noformProps={{
            inline: true,
            inset: true,
            value: this.props.value
          }}
        >
          {this.props.inline ? this.buttons : null}
        </Form>
        {this.props.inline ? null : this.buttons}
        {this.props.children}
      </div>
    );
  }
}
