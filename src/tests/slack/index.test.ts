import { App } from '@slack/bolt';
import 'jest';
import logger from '../../logger';
import { setupSlack } from '../../slack';

const loggerDebugSpy = jest.spyOn(logger, 'debug').mockImplementation();
const mockApp = {
  action: jest.fn(),
  view: jest.fn(),
  shortcut: jest.fn(),
};
describe('slack app setup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds a listener that ignores actions and logs debug info', async () => {
    setupSlack(mockApp as unknown as App);
    expect(mockApp.action).toBeCalledWith(/ignore.*/i, expect.anything());
    const [, ignoreActionHandler] = mockApp.action.mock.calls[0];

    // Test the handler itself
    const ack = jest.fn();
    await ignoreActionHandler({ ack });
    expect(loggerDebugSpy).toBeCalledTimes(1);
    expect(ack).toBeCalledTimes(1);
  });
});
