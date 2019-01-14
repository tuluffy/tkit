import * as React from 'react';
import { shallow } from 'enzyme';
import { SFCHeader } from '@src/features/home/SFCHeader';

describe('common/SFCHeader', () => {
  it('renders node with correct class name', () => {
    // @ts-ignore // if SFCHeader is connect
    const renderedComponent = shallow(<SFCHeader />);
  });
});
