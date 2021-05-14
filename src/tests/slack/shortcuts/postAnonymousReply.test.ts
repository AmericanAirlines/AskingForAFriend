/* eslint-disable  @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/first */
import 'jest';
import supertest from 'supertest';
import logger from '../../../logger';
import { receiver, app } from '../../../app';
import { env } from '../../../env';
import { createHash } from '../utils/slack';
import { callbackIds } from '../../../slack/constants';

jest.mock('../../../env');

const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();
const viewsOpenSpy = jest.spyOn(app.client.views, 'open').mockImplementation();

const timestamp = new Date().valueOf();

const trigger_id = '1234';
const mockShortcutPayload: any = {
  type: 'message_action',
  team: { id: 'XXX', domain: 'XXX' },
  user: { id: 'XXX', username: 'XXX', team_id: 'XXX' },
  callback_id: callbackIds.postReplyAnonymously,
  trigger_id,
  message: { text: 'Mock Reply' },
};

const mockLargeShortcutPayload: any = {
  type: 'message_action',
  team: { id: 'XXX', domain: 'XXX' },
  user: { id: 'XXX', username: 'XXX', team_id: 'XXX' },
  callback_id: callbackIds.postReplyAnonymously,
  trigger_id,
  message: { text: 'Mock Reply'.repeat(3000) },
};

describe('submit ticket shortcut handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('posts a message in the thread where the shortcut was invoked', async () => {
    const signature = createHash(mockLargeShortcutPayload, timestamp, env.slackSigningSecret);
    await supertest(receiver.app)
      .post('/slack/events')
      .send(mockLargeShortcutPayload)
      .set({
        'x-slack-signature': signature,
        'x-slack-request-timestamp': timestamp,
      })
      .expect(200);

    expect(viewsOpenSpy).toBeCalled();
    expect(loggerErrorSpy).not.toBeCalled();

    const args = viewsOpenSpy.mock.calls[0][0];
    expect(args.trigger_id).toEqual(trigger_id);
    expect(args.view.callback_id).toEqual(callbackIds.postReplyAnonymouslySubmitted);
  });

  it('posts a message in the thread where the shortcut was invoked with a large payload', async () => {
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
    expect(loggerErrorSpy).not.toBeCalled();

    const args = viewsOpenSpy.mock.calls[0][0];
    expect(args.trigger_id).toEqual(trigger_id);
    expect(args.view.callback_id).toEqual(callbackIds.postReplyAnonymouslySubmitted);
  });

  it("logs an error if the modal can't be opened", async () => {
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
