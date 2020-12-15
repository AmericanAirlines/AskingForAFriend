/* eslint-disable camelcase */
import { Middleware, SlackShortcutMiddlewareArgs, SlackShortcut } from '@slack/bolt';
import logger from '../../logger';
import { app } from '../../app';
import { getPostAnonymousQuestionModalBlocks } from '../blocks/postAnonymousQuestion';
import { callbackIds } from '../constants';
import { env } from '../../env';

export const postAnonymousQuestion: Middleware<SlackShortcutMiddlewareArgs<SlackShortcut>> = async ({
  shortcut,
  ack,
}) => {
  ack();
  try {
    await app.client.views.open({
      token: env.slackToken,
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
