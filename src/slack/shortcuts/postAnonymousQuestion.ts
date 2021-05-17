import { Middleware, SlackShortcutMiddlewareArgs, SlackShortcut } from '@slack/bolt';
import logger from '../../logger';
import { getPostAnonymousQuestionModalBlocks } from '../blocks/postAnonymousQuestion';
import { callbackIds } from '../constants';

export const postAnonymousQuestion: Middleware<SlackShortcutMiddlewareArgs<SlackShortcut>> = async ({
  shortcut,
  ack,
  client,
}) => {
  void ack();
  try {
    await client.views.open({
      trigger_id: shortcut.trigger_id,
      view: {
        callback_id: callbackIds.postQuestionAnonymouslySubmitted,
        type: 'modal',
        title: {
          type: 'plain_text',
          text: 'Ask Question Anonymously',
        },
        blocks: getPostAnonymousQuestionModalBlocks(),
        submit: {
          type: 'plain_text',
          text: 'Ask Question',
        },
      },
    });
  } catch (error) {
    logger.error('Something went wrong publishing a view to Slack: ', error);
  }
};
