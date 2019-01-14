import * as React from 'react';
import { shallow } from 'enzyme';
import { SFCFooter } from '@src/features/home/SFCFooter';

describe('common/SFCFooter', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(<SFCFooter />);
  });
});
