import 'jest';
import logger from '../../../logger';
import { makeMockMessageShortcutMiddlewarePayload } from '../../test-utils/makeMockMiddlewarePayload';
import { postAnonymousReply } from '../../../slack/shortcuts/postAnonymousReply';

jest.mock('../../../env');

const loggerErrorSpy = jest.spyOn(logger, 'error').mockImplementation();
const mockShortcutPayload = makeMockMessageShortcutMiddlewarePayload({
  ack: jest.fn(),
  body: {
    trigger_id: '',
    user: {
      id: 'user_id',
    },
  },
  client: {
    views: {
      open: jest.fn(),
    },
  },
  shortcut: {
    message_ts: '123',
    channel: { id: 'CHANNEL_ID' },
    trigger_id: 'TRIGGER_ID',
    message: {
      text: 'this is my message',
    } as any,
  },
});

const mockLargeShortcutPayload = makeMockMessageShortcutMiddlewarePayload({
  ack: jest.fn(),
  body: {
    trigger_id: '',
    user: {
      id: 'user_id',
    },
  },
  client: {
    views: {
      open: jest.fn(),
    },
  },
  shortcut: {
    message_ts: '123',
    channel: { id: 'CHANNEL_ID' },
    trigger_id: 'TRIGGER_ID',
    message: {
      text: 'this is my message'.repeat(3000),
    } as any,
  },
});

const mockEmptyOriginalPostPayload = makeMockMessageShortcutMiddlewarePayload({
  ack: jest.fn(),
  body: {
    trigger_id: '',
    user: {
      id: 'user_id',
    },
  },
  client: {
    views: {
      open: jest.fn(),
    },
  },
  shortcut: {
    message_ts: '123',
    channel: { id: 'CHANNEL_ID' },
    trigger_id: 'TRIGGER_ID',
    message: {
      text: '',
    } as any,
  },
});

describe('postQuestionAnonymously view submission listener', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully opens modal with a input field asking for their reply', async () => {
    await postAnonymousReply(mockShortcutPayload as any);

    expect(mockShortcutPayload.client.views.open).toBeCalled();
    expect(mockShortcutPayload.client.views.open).toBeCalledWith(
      expect.objectContaining({
        view: expect.objectContaining({
          blocks: expect.arrayContaining([
            expect.objectContaining({
              text: expect.objectContaining({
                text: expect.stringContaining('Original Post'),
              }),
            }),
          ]),
        }),
      }),
    );
  });

  it('successfully opens modal with a input field asking for their reply with large original post', async () => {
    await postAnonymousReply(mockLargeShortcutPayload as any);

    expect(mockLargeShortcutPayload.client.views.open).toBeCalled();
    expect(mockLargeShortcutPayload.client.views.open).toBeCalledWith(
      expect.objectContaining({
        view: expect.objectContaining({
          blocks: expect.arrayContaining([
            expect.objectContaining({
              text: expect.objectContaining({
                text: expect.stringContaining('this is my message'),
              }),
            }),
          ]),
        }),
      }),
    );
  });

  it('successfully opens modal with a input field asking for their reply no original post', async () => {
    await postAnonymousReply(mockEmptyOriginalPostPayload as any);

    expect(mockEmptyOriginalPostPayload.client.views.open).toBeCalled();
    expect(mockEmptyOriginalPostPayload.client.views.open).toBeCalledWith(
      expect.objectContaining({
        view: expect.objectContaining({
          blocks: expect.arrayContaining([
            expect.objectContaining({
              text: expect.objectContaining({
                text: expect.stringContaining('The original post has no text to display'),
              }),
            }),
          ]),
        }),
      }),
    );
  });

  it("multiple errors are logged when the modal can't be opened", async () => {
    mockShortcutPayload.client.views.open.mockRejectedValueOnce(null);
    await postAnonymousReply(mockShortcutPayload as any);

    expect(loggerErrorSpy).toBeCalledTimes(1);
  });
});
