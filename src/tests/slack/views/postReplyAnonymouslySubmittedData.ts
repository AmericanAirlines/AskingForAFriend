/* eslint-disable @typescript-eslint/no-explicit-any */
import { callbackIds } from '../../../slack/constants';

export const username = 'Someone';
export const question = 'Testing is cool, right?';

export const keys = {
  blockIds: {
    question: 'questionBlockId',
  },
  actionIds: {
    question: 'questionActionId',
  },
};

export const mockPostReplyAnonymouslySubmission = {
  type: 'view_submission',
  team: { id: 'XXX', domain: 'XXX' },
  user: { id: 'XXX', username, name: username, team_id: 'XXX' },
  trigger_id: 'XXX',
  view: {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Original Post*',
        },
      },
      {
        type: 'input',
        block_id: keys.blockIds.question,
        label: { type: 'plain_text', text: "What's your question?", emoji: true },
        element: { type: 'plain_text_input', action_id: keys.actionIds.question },
      },
    ],
    callback_id: callbackIds.replyAnonymouslySubmitted,
    state: {
      values: {
        [keys.blockIds.question]: { [keys.actionIds.question]: { type: 'plain_text_input', value: question } },
      },
    },
    private_metadata: JSON.stringify({ message_ts: 123, channel: { id: 'CHANNEL_ID' } }),
  },
};
