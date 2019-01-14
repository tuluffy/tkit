import * as React from 'react';
import { shallow } from 'enzyme';

import Modal from '@src/features/common/Modal';

describe('common/Modal', () => {
  it('renders node with correct class name', () => {
    const renderedComponent = shallow(<Modal />);
    const props = renderedComponent.props();
    expect(props.getContainer).toBeInstanceOf(Function);
    ['info', 'success', 'error', 'warning', 'warn', 'confirm'].forEach(method => {
      expect(Modal[method]).toBeInstanceOf(Function);
    });
  });
});
