/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/first */
import 'jest';
import supertest from 'supertest';
import { createHash } from '../utils/slack';
import logger from '../../../logger';
import { receiver, app } from '../../../app';
import { callbackIds } from '../../../slack/constants';
import { env } from '../../../env';

jest.mock('../../../env');

const trigger_id = '1234';
const mockShortcutPayload: any = {
  type: 'shortcut',
  team: { id: 'XXX', domain: 'XXX' },
  user: { id: 'XXX', username: 'XXX', team_id: 'XXX' },
  callback_id: callbackIds.postAnonymousQuestion,
  trigger_id,
};

const viewsOpenSpy = jest.spyOn(app.client.views, 'open').mockImplementation();
const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();

describe('ignore action listener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles the shortcut and opens a modal', async () => {
    const timestamp = new Date().valueOf();
    const signature = createHash(mockShortcutPayload, timestamp, env.slackSigningSecret);
    await supertest(receiver.app)
      .post('/slack/events')
      .send(mockShortcutPayload)
      .set({
        'x-slack-signature': signature,
        'x-slack-request-timestamp': timestamp,
      })
      .expect(200);

    expect(viewsOpenSpy).toBeCalled();
    const args = viewsOpenSpy.mock.calls[0][0];
    expect(args.trigger_id).toEqual(trigger_id);
  });

  it("logs an error if the modal can't be opened", async () => {
    const timestamp = new Date().valueOf();
    const signature = createHash(mockShortcutPayload, timestamp, env.slackSigningSecret);
    viewsOpenSpy.mockRejectedValueOnce(null);
    await supertest(receiver.app)
      .post('/slack/events')
      .send(mockShortcutPayload)
      .set({
        'x-slack-signature': signature,
        'x-slack-request-timestamp': timestamp,
      })
      .expect(200);

    expect(viewsOpenSpy).toBeCalled();
    expect(loggerErrorSpy).toBeCalled();
  });
});
