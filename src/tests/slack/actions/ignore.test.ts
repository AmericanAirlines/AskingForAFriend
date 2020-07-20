/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/first */
import 'jest';
import supertest from 'supertest';
import { createHash } from '../utils/slack';
import logger from '../../../logger';

const signingSecret = 'Secret';
process.env.SLACK_SIGNING_SECRET = signingSecret;
import { receiver } from '../../../app';
import { actionIds } from '../../../slack/constants';

const mockIgnoreEvent: any = {
  type: 'block_actions',
  user: { id: 'XXX', username: 'XXX', name: 'XXX', team_id: 'XXX' },
  team: { id: 'XXX', domain: 'XXX' },
  actions: [
    {
      action_id: actionIds.ignore,
      block_id: 'XXX',
      type: 'button',
    },
  ],
};

const loggerSpy = jest.spyOn(logger, 'debug').mockImplementation();

describe('ignore action listener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully ignores the issue', async () => {
    const timestamp = new Date().valueOf();
    const signature = createHash(mockIgnoreEvent, timestamp, signingSecret);
    await supertest(receiver.app)
      .post('/slack/events')
      .send(mockIgnoreEvent)
      .set({
        'x-slack-signature': signature,
        'x-slack-request-timestamp': timestamp,
      })
      .expect(200);
    expect(loggerSpy).toBeCalled();
  });
});
