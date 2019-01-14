import * as React from 'react';
import { shallow } from 'enzyme';

import { ListPage } from '@src/features/home/ListPage';

describe('home/ListPage', () => {
  it('renders node with correct class name', () => {
    // @ts-ignore // if ListPage is connect
    const renderedComponent = shallow(<ListPage />);
  });
});
