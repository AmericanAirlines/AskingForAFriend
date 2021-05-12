import { KnownBlock, InputBlock } from '@slack/types';

export function getPostAnonymousReplyBlock(originalPost: string): KnownBlock[] {
  const originalPostBlock: KnownBlock = {
    type: 'section',
    text: {
      type: 'mrkdwn',
      text: `*Original Post* \n>${originalPost}`,
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
    },
  };
  return [originalPostBlock, questionBlock];
}
