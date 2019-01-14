import * as React from 'react';
import { shallow, mount } from 'enzyme';

import Editor from '@src/features/common/Editor';

describe('common/Editor', () => {
  it('renders node with correct class name', () => {
    let inst: Editor = {} as Editor;
    const value = '300';
    const newValue = '200';
    const ref = jest.fn((i: Editor) => {
      inst = i;
    });
    const onChange = jest.fn();
    const renderedComponent = mount(
      <Editor value={value} getEditor={ref} disabled onChange={onChange} />
    );
    expect(ref).toBeCalled();
    expect(inst.getValue).toBeInstanceOf(Function);
    expect(inst.getValue()).toEqual(value);
    // update
    onChange.mockReset();
    renderedComponent.setProps({ value: newValue, disabled: false });
    expect(inst.getValue()).toEqual(newValue);
    expect(onChange).toBeCalledWith(newValue);
    // inset
    onChange.mockReset();
    inst.insert('nihao');
    expect(!!inst.getValue().match(/nihao/g)).toBeTruthy();
    inst.insert('link', 'http://baidu.com');
    expect(!!inst.getValue().match(/link/g)).toBeTruthy();
    expect(onChange).toBeCalledTimes(2);

    renderedComponent.unmount();
  });
});
