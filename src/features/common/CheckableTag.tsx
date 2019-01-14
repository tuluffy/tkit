import * as React from 'react';
import { Tag } from 'antd';

import './CheckableTag.less';

const { CheckableTag: AntCheckableTag } = Tag;

// own props
export interface ICheckableTagProps {
  value?: any;
  multiple?: boolean;
  tags: Array<string | number | { value: any; label: any }>;
  onChange?: (val: any) => void;
  disabled?: boolean;
}

// own state
export interface ICheckableTagState {}

type Props = ICheckableTagProps;

export default class CheckableTag extends React.Component<Props, ICheckableTagState> {
  public static defaultProps = {
    tags: []
  };

  public handleChange = (checked: boolean, name: string | number) => {
    const { value, multiple, onChange, disabled } = this.props;
    if (!disabled) {
      let val: any;
      if (multiple) {
        if (Array.isArray(value)) {
          if (checked) {
            val = [...value, name];
          } else {
            val = value.filter((v: any) => v !== name);
          }
        } else if (checked) {
          val = [name];
        }
      } else if (checked) {
        val = name;
      }
      if (onChange) {
        onChange(val);
      }
    }
  };

  public isChecked(current: any) {
    const { multiple, value } = this.props;
    if (multiple) {
      return Array.isArray(value) && value.indexOf(current) !== -1;
    } else {
      return current === value;
    }
  }

  public render() {
    const { tags, disabled } = this.props;
    return (
      <div className={`k-common-checkable-tag${disabled ? 'k-common-disabled' : ''}`}>
        {tags.map(tag => {
          let name: any;
          let label;
          if (tag && typeof tag === 'object') {
            name = tag.value;
            label = 'label' in tag ? tag.label : name;
          } else {
            name = label = tag;
          }
          const onChange = (checked: boolean) => this.handleChange(checked, name);
          return (
            <AntCheckableTag key={name} checked={this.isChecked(name)} onChange={onChange}>
              {label}
            </AntCheckableTag>
          );
        })}
      </div>
    );
  }
}
