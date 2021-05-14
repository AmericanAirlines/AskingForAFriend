import 'jest';
import logger from '../../../logger';
import { ViewOutputUtils } from '../../../slack/common/ViewOutputUtils';
import { postQuestionAnonymouslySubmitted } from '../../../slack/views/postQuestionAnonymouslySubmitted';
import { makeMockViewMiddlewarePayload } from '../test-utils/makeMockMiddlewarePayload';

const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();
const loggerInfoSpy = jest.spyOn(logger, 'info').mockImplementation();

jest.mock('../../../slack/common/ViewOutputUtils.ts', () => ({
  ViewOutputUtils: jest.fn(() => ({
    getInputValue: jest.fn(() => {}),
  })),
}));
const mockViewOutputUtils = ViewOutputUtils as jest.Mock;

const mockViewPayload = makeMockViewMiddlewarePayload({
  ack: jest.fn(),
  body: {
    trigger_id: 'abcd',
    user: {
      name: 'Someone Cool',
      id: '4556',
    },
  },
  client: {
    views: {
      open: jest.fn(),
    },
    chat: {
      postMessage: jest.fn(),
    },
  },
});

describe('postQuestionAnonymously view submission listener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully responds, posts a question, and logs data for the question', async () => {
    const channel = '1234';
    const question = 'How do things be?';
    const getInputValue = jest
      .fn()
      .mockReturnValueOnce({ selected_channel: channel })
      .mockReturnValueOnce({ value: question });
    mockViewOutputUtils.mockReturnValueOnce({
      getInputValue,
    });
    await postQuestionAnonymouslySubmitted(mockViewPayload as any);

    expect(mockViewPayload.ack).toBeCalledTimes(1);
    expect(mockViewPayload.client.chat.postMessage).toBeCalledTimes(1);
    expect(mockViewPayload.client.chat.postMessage).toBeCalledWith(
      expect.objectContaining({
        channel,
        text: expect.stringContaining(question),
      }),
    );
    expect(loggerInfoSpy).toBeCalledTimes(1);
  });

  it('tries to open an error modal when something goes wrong', async () => {
    mockViewOutputUtils.mockReturnValueOnce(new Error('Something went wrong!'));
    await postQuestionAnonymouslySubmitted(mockViewPayload as any);

    expect(mockViewPayload.ack).toBeCalledTimes(1);
    expect(loggerErrorSpy).toBeCalledTimes(1);
    expect(mockViewPayload.client.chat.postMessage).not.toBeCalled();
    expect(mockViewPayload.client.views.open).toBeCalledTimes(1);
    expect(mockViewPayload.client.views.open).toBeCalledWith(
      expect.objectContaining({
        trigger_id: mockViewPayload.body.trigger_id,
        view: expect.objectContaining({
          type: 'modal',
          title: expect.objectContaining({
            text: 'Error',
          }),
          blocks: expect.arrayContaining([expect.anything()]),
        }),
      }),
    );
  });

  it("multiple errors are logged when the modal can't be opened", async () => {
    mockViewOutputUtils.mockReturnValueOnce(new Error('Something went wrong!'));
    mockViewPayload.client.views.open.mockRejectedValueOnce(new Error("Can't open this!"));
    await postQuestionAnonymouslySubmitted(mockViewPayload as any);

    expect(mockViewPayload.ack).toBeCalledTimes(1);
    expect(mockViewPayload.client.chat.postMessage).not.toBeCalled();
    expect(mockViewPayload.client.views.open).toBeCalledTimes(1);
    expect(loggerErrorSpy).toBeCalledTimes(2);
  });
});
