import 'jest';
import logger from '../../../logger';
import { postAnonymousReplySubmitted } from '../../../slack/views/postAnonymousReplySubmitted';
import { makeMockViewMiddlewarePayload } from '../../test-utils/makeMockMiddlewarePayload';
import { ViewOutputUtils } from '../../../slack/common/ViewOutputUtils';

jest.mock('../../../slack/common/ViewOutputUtils.ts', () => ({
  ViewOutputUtils: jest.fn(() => ({
    getInputValue: jest.fn(() => {}),
  })),
}));
const mockViewOutputUtils = ViewOutputUtils as jest.Mock;
const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();
const loggerInfoSpy = jest.spyOn(logger, 'info').mockImplementation();
const reply = 'My Reply';
const privateMetadata = { message_ts: '123', channel: { id: 'CHANNEL_ID' } };
const mockActionPayload = makeMockViewMiddlewarePayload({
  ack: jest.fn(),
  body: {
    trigger_id: '',
    user: {
      id: '123',
    },
  },
  client: {
    users: {
      info: jest.fn(() => ({
        user: {
          profile: {
            email: 'asdasd@asdasd.com',
          },
        },
      })),
    },
    chat: { postMessage: jest.fn() },
  },
  view: { private_metadata: JSON.stringify(privateMetadata) },
});
describe('postQuestionAnonymously view submission listener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully responds, posts a question, and logs data for the question', async () => {
    const getInputValue = jest.fn().mockReturnValueOnce({ value: reply });
    mockViewOutputUtils.mockReturnValueOnce({
      getInputValue,
    });
    await postAnonymousReplySubmitted(mockActionPayload as any);

    expect(mockActionPayload.client.chat.postMessage).toBeCalledTimes(1);
    expect(loggerInfoSpy).toBeCalledTimes(1);
    expect(mockActionPayload.client.chat.postMessage).toBeCalledWith(
      expect.objectContaining({
        blocks: expect.arrayContaining([
          expect.objectContaining({
            text: expect.objectContaining({ text: expect.stringContaining(reply) }),
          }),
          expect.anything(),
        ]),
      }),
    );
  });

  it("multiple errors are logged when the modal can't be opened", async () => {
    mockActionPayload.client.chat.postMessage.mockRejectedValueOnce(null);
    await postAnonymousReplySubmitted(mockActionPayload as any);

    expect(loggerErrorSpy).toBeCalledTimes(2);
  });
});
