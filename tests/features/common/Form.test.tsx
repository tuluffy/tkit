import * as React from 'react';
import { shallow, mount } from 'enzyme';

import Form, {
  WrapComponentsToNoform,
  FormItem,
  WrappedInput,
  IFormProps
} from '@src/features/common/Form';

describe('common/Form', () => {
  const TestRender = jest.fn((props: any) => {
    return null;
  }) as React.ComponentClass<any>;
  it('renders node with correct class name', async () => {
    let form = {} as Form;
    const [Wrapped] = WrapComponentsToNoform([TestRender]);
    const Render = jest.fn((props: any) => (
      <div>
        <FormItem label="test" name="test" key="test">
          <TestRender />
        </FormItem>
        <FormItem label="t" name="t" key="t">
          <WrappedInput />
        </FormItem>
      </div>
    ));
    const getForm = jest.fn(f => {
      form = f;
    });
    const noformProps: IFormProps['noformProps'] = {
      value: {
        test: 2,
        t: 'text'
      }
    };
    const renderedComponent = mount(
      <Form Render={Render} getForm={getForm} noformProps={noformProps} />
    );
    expect(Render).toBeCalledWith({}, {});
    expect(TestRender).toBeCalled();
    expect(form.validate instanceof Function).toBeTruthy();
    const values = await form.submit();
    expect(values).toMatchObject(noformProps.value);
  });
});
