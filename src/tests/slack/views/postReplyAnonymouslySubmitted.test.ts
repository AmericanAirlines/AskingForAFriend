import 'jest';
import logger from '../../../logger';
import { mockPostReplyAnonymouslySubmission } from './postReplyAnonymouslySubmittedData';
import { postAnonymousReplySubmitted } from '../../../slack/views/postAnonymousReplySubmitted';
import { makeMockViewMiddlewarePayload } from '../../test-utils/makeMockMiddlewarePayload';

jest.mock('../../../env');

const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();
const loggerInfoSpy = jest.spyOn(logger, 'info').mockImplementation();
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
  view: mockPostReplyAnonymouslySubmission.view as any,
});
describe('postQuestionAnonymously view submission listener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully responds, posts a question, and logs data for the question', async () => {
    await postAnonymousReplySubmitted(mockActionPayload as any);

    expect(mockActionPayload.client.chat.postMessage).toBeCalled();
    expect(loggerInfoSpy).toBeCalledTimes(1);
    const messageArgs = mockActionPayload.client.chat.postMessage.mock.calls[0][0];
    const { blocks } = messageArgs;
    expect(messageArgs.text).toBe(' ');
    expect(blocks[0]).toEqual(
      expect.objectContaining({
        text: expect.objectContaining({ text: expect.stringContaining('Testing is cool, right?') }),
      }),
    );
  });

  it("multiple errors are logged when the modal can't be opened", async () => {
    mockActionPayload.client.chat.postMessage.mockRejectedValueOnce(null);
    await postAnonymousReplySubmitted(mockActionPayload as any);

    expect(loggerErrorSpy).toBeCalledTimes(2);
  });
});
