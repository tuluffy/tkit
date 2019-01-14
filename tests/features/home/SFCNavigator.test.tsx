import * as React from 'react';
import { shallow } from 'enzyme';
import { SFCNavigator } from '@src/features/home/SFCNavigator';

describe('common/SFCNavigator', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(<SFCNavigator />);
  });
});
