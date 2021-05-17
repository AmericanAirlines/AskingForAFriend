import { KnownBlock, InputBlock } from '@slack/types';

export const postAnonymousReplyModalInputIds = {
  reply: 'reply',
};

export function getPostAnonymousReplyViewBlocks(originalPost?: string): KnownBlock[] {
  const header: KnownBlock = {
    type: 'header',
    text: {
      type: 'plain_text',
      text: 'Original Post',
    },
  };
  const originalPostBlock: KnownBlock = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `${originalPost || 'The original post has no text to display'}`,
    },
  };
  const questionBlock: InputBlock = {
    type: 'input',
    label: {
      type: 'plain_text',
      text: "What's your response?",
    },
    hint: {
      type: 'plain_text',
      text: 'This will be anonymously posted to a thread for this message',
    },
    element: {
      type: 'plain_text_input',
      action_id: postAnonymousReplyModalInputIds.reply,
    },
  };
  return [header, originalPostBlock, questionBlock];
}
