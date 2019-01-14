import * as React from 'react';
import { shallow } from 'enzyme';

import CheckableTag from '@src/features/common/CheckableTag';

describe('common/CheckableTag', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(<CheckableTag />);
  });
});
