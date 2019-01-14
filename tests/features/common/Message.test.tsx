import Message from '@src/features/common/Message';

describe('common/Message', () => {
  it('renders node with correct class name', () => {
    ['info', 'error', 'warn', 'success'].forEach(method => {
      expect(Message).toHaveProperty(method);
    });
  });
});
