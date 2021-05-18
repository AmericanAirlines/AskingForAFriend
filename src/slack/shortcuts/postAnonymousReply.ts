import { Middleware, SlackShortcutMiddlewareArgs, MessageShortcut } from '@slack/bolt';
import logger from '../../logger';
import { callbackIds } from '../constants';
import { getPostAnonymousReplyViewBlocks } from '../blocks/postAnonymousReply';

export const postAnonymousReply: Middleware<SlackShortcutMiddlewareArgs<MessageShortcut>> = async ({
  shortcut,
  ack,
  client,
}) => {
  void ack();
  try {
    const details = await
      client.conversations.info({
        channel: shortcut.channel.id,
      });

    if (details.channel!.is_private) {
      throw new Error('Channel is private');
    }

  } catch (error) {
    await client.views.open({
      trigger_id: shortcut.trigger_id,
      view: {
        type: 'modal',
        title: {
          type: 'plain_text',
          text: 'Uh oh...',
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `You can only reply anonymously to posts made in public channels. Sorry about that!`,
            },
          },
        ],
      },
    });
    return;
  }

  try {
    const originalPost = shortcut.message.text!;
    await client.views.open({
      trigger_id: shortcut.trigger_id,
      view: {
        private_metadata: JSON.stringify({ message_ts: shortcut.message_ts, channel: shortcut.channel }),
        callback_id: callbackIds.postAnonymousReplySubmitted,
        type: 'modal',
        title: {
          type: 'plain_text',
          text: 'Respond Anonymously',
        },
        blocks: getPostAnonymousReplyViewBlocks(
          originalPost.length > 3000 ? `${originalPost.substring(0, 2000)}...` : originalPost,
        ),
        submit: {
          type: 'plain_text',
          text: 'Reply Anonymously',
        },
      },
    });
  } catch (error) {
    logger.error('Something went wrong publishing a view to Slack: ', error);
  }
};
