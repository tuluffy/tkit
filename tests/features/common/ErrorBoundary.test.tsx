import * as React from 'react';
import { shallow } from 'enzyme';

import ErrorBoundary from '@src/features/common/ErrorBoundary';

describe('common/ErrorBoundary', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(<ErrorBoundary />);
  });
});
