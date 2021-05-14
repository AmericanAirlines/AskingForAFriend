import { KnownBlock, InputBlock } from '@slack/types';

export const postAnonymousQuestionModalInputIds = {
  channelId: 'channelId',
  question: 'question',
};

export function getPostAnonymousQuestionModalBlocks(): KnownBlock[] {
  const channelSelectBlock: InputBlock = {
    type: 'input',
    label: {
      type: 'plain_text',
      text: 'Where should your question be asked?',
    },
    hint: {
      type: 'plain_text',
      text: ' NOTE: must be a public channel',
    },
    element: {
      type: 'channels_select',
      action_id: postAnonymousQuestionModalInputIds.channelId,
    },
  };
  const questionBlock: InputBlock = {
    type: 'input',
    label: {
      type: 'plain_text',
      text: "What's your question?",
    },
    hint: {
      type: 'plain_text',
      text: 'This will be anonymously posted to the channel above',
    },
    element: {
      type: 'plain_text_input',
      action_id: postAnonymousQuestionModalInputIds.question,
    },
  };
  return [channelSelectBlock, questionBlock];
}
