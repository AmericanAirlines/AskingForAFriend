import 'jest';
import {
  getPostAnonymousQuestionModalBlocks,
  postAnonymousQuestionModalInputIds,
} from '../../../slack/blocks/postAnonymousQuestion';

describe('postAnonymousQuestion blocks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a channel selection block and a question input block', () => {
    const blocks = getPostAnonymousQuestionModalBlocks();

    expect(blocks[0]).toEqual(
      expect.objectContaining({
        type: 'input',
        label: expect.objectContaining({
          text: 'Where should your question be asked?',
        }),
        element: {
          type: 'channels_select',
          action_id: postAnonymousQuestionModalInputIds.channelId,
        },
      }),
    );

    expect(blocks[1]).toEqual(
      expect.objectContaining({
        type: 'input',
        label: expect.objectContaining({
          text: `What's your question?`,
        }),
        element: {
          type: 'plain_text_input',
          action_id: postAnonymousQuestionModalInputIds.question,
        },
      }),
    );
  });
});
