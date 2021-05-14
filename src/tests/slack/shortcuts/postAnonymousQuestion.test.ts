import 'jest';
import logger from '../../../logger';
import { callbackIds } from '../../../slack/constants';

jest.mock('../../../env');

const triggerId = '1234';
const mockShortcutPayload: any = {
  type: 'shortcut',
  team: { id: 'XXX', domain: 'XXX' },
  user: { id: 'XXX', username: 'XXX', team_id: 'XXX' },
  callback_id: callbackIds.postAnonymousQuestion,
  trigger_id: triggerId,
};

// const viewsOpenSpy = jest.spyOn(app.client.views, 'open').mockImplementation();
const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();

describe('ignore action listener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  xit('handles the shortcut and opens a modal', async () => {
    // expect(viewsOpenSpy).toBeCalled();
    // const args = viewsOpenSpy.mock.calls[0][0];
    // expect(args?.trigger_id).toEqual(triggerId);
  });

  xit("logs an error if the modal can't be opened", async () => {
    // expect(viewsOpenSpy).toBeCalled();
    expect(loggerErrorSpy).toBeCalled();
  });
});
