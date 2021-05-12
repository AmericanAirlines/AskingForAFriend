/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/first */
import 'jest';
import supertest from 'supertest';
import { createHash } from '../utils/slack';
import logger from '../../../logger';
import { app, receiver } from '../../../app';
import { mockPostReplyAnonymouslySubmission } from './postReplyAnonymouslySubmittedData';
import { env } from '../../../env';

jest.mock('../../../env');

const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();
const loggerInfoSpy = jest.spyOn(logger, 'info').mockImplementation();
const postMessageSpy = jest.spyOn(app.client.chat, 'postMessage').mockImplementation();
const viewsOpenSpy = jest.spyOn(app.client.views, 'open').mockImplementation();

describe('postQuestionAnonymously view submission listener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully responds, posts a question, and logs data for the question', async () => {
    const timestamp = new Date().valueOf();
    const signature = createHash(mockPostReplyAnonymouslySubmission, timestamp, env.slackSigningSecret);
    await supertest(receiver.app)
      .post('/slack/events')
      .send(mockPostReplyAnonymouslySubmission)
      .set({
        'x-slack-signature': signature,
        'x-slack-request-timestamp': timestamp,
      })
      .expect(200);

    expect(postMessageSpy).toBeCalled();
    const messageArgs = postMessageSpy.mock.calls[0][0];
    const { blocks } = messageArgs;
    expect(messageArgs.text).toBe(' ');
    expect(blocks[0]).toEqual(
      expect.objectContaining({
        text: expect.objectContaining({ text: expect.stringContaining('Testing is cool, right?') }),
      }),
    );
    expect(loggerInfoSpy).toBeCalled();
    expect(viewsOpenSpy).not.toBeCalled();
  });

  it('tries to open an error modal when something goes wrong', async () => {
    postMessageSpy.mockRejectedValueOnce(null);
    const timestamp = new Date().valueOf();
    const signature = createHash(mockPostReplyAnonymouslySubmission, timestamp, env.slackSigningSecret);
    await supertest(receiver.app)
      .post('/slack/events')
      .send(mockPostReplyAnonymouslySubmission)
      .set({
        'x-slack-signature': signature,
        'x-slack-request-timestamp': timestamp,
      })
      .expect(200);

    expect(postMessageSpy).toBeCalled();
    expect(viewsOpenSpy).toBeCalled();
    expect(loggerErrorSpy).toBeCalledTimes(1);
  });

  it("multiple errors are logged when the modal can't be opened", async () => {
    postMessageSpy.mockRejectedValueOnce(null);
    viewsOpenSpy.mockRejectedValueOnce(null);
    const timestamp = new Date().valueOf();
    const signature = createHash(mockPostReplyAnonymouslySubmission, timestamp, env.slackSigningSecret);
    await supertest(receiver.app)
      .post('/slack/events')
      .send(mockPostReplyAnonymouslySubmission)
      .set({
        'x-slack-signature': signature,
        'x-slack-request-timestamp': timestamp,
      })
      .expect(200);

    expect(postMessageSpy).toBeCalled();
    expect(viewsOpenSpy).toBeCalled();
    expect(loggerErrorSpy).toBeCalledTimes(2);
  });
});
