import * as React from 'react';
import { mount } from 'enzyme';

import { EventCenter } from '@src/utils/';
import EventWrapper, { IEventWrapperProps } from '@src/features/common/EventWrapper';

describe('common/EventWrapper', () => {
  describe('common/EventWrapper', () => {
    it('subscribe works ok', () => {
      const mes = {};
      const callback = jest.fn(() => null);
      const TestRender = jest.fn((props: IEventWrapperProps) => {
        expect(props.on).toBeInstanceOf(Function);
        expect(props.once).toBeInstanceOf(Function);
        expect(props.emit).toBeInstanceOf(Function);
        props.on('test', callback);
        return null;
      });
      const CP = EventWrapper(TestRender);
      const tree = mount(<CP callback={callback} />);
      callback.mockClear();
      EventCenter.emit('test', mes);
      expect(callback).toBeCalledWith(mes);
      expect(callback).toBeCalledTimes(1);

      callback.mockClear();
      tree.unmount();
      EventCenter.emit('test', mes);
      expect(callback).toBeCalledTimes(0);
    });
  });
});
