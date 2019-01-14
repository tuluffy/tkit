import * as React from 'react';
import { shallow } from 'enzyme';
import { SFCErrorInfo } from '@src/features/common/SFCErrorInfo';

describe('common/SFCErrorInfo', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(<SFCErrorInfo error message="test" />);
  });
});
