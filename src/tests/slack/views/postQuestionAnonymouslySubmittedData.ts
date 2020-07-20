/* eslint-disable @typescript-eslint/no-explicit-any */
import { callbackIds } from '../../../slack/constants';

export const selectedChannel = 'ABCD';
export const username = 'Someone';
export const question = 'Testing is cool, right?';

export const keys = {
  blockIds: {
    channelSelect: 'channelSelectBlockId',
    question: 'questionBlockId',
  },
  actionIds: {
    channelSelect: 'notificationsActionId',
    question: 'questionActionId',
  },
};

export const mockPostQuestionAnonymouslySubmission = {
  type: 'view_submission',
  team: { id: 'XXX', domain: 'XXX' },
  user: { id: 'XXX', username, name: username, team_id: 'XXX' },
  trigger_id: 'XXX',
  view: {
    blocks: [
      {
        type: 'input',
        block_id: keys.blockIds.channelSelect,
        label: { type: 'plain_text', text: 'Where should your question be asked?', emoji: true },
        element: { type: 'channels_select', action_id: keys.actionIds.channelSelect },
      },
      {
        type: 'input',
        block_id: keys.blockIds.question,
        label: { type: 'plain_text', text: "What's your question?", emoji: true },
        element: { type: 'plain_text_input', action_id: keys.actionIds.question },
      },
    ],
    callback_id: callbackIds.postQuestionAnonymouslySubmitted,
    state: {
      values: {
        [keys.blockIds.channelSelect]: {
          [keys.actionIds.channelSelect]: { type: 'channels_select', selected_channel: selectedChannel },
        },
        [keys.blockIds.question]: { [keys.actionIds.question]: { type: 'plain_text_input', value: question } },
      },
    },
  },
};
