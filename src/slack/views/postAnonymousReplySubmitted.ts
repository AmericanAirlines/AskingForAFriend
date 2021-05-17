import { Middleware, ViewSubmitAction, SlackViewMiddlewareArgs } from '@slack/bolt';
import { KnownBlock } from '@slack/types';
import logger from '../../logger';
import { postAnonymousReplyModalInputIds } from '../blocks/postAnonymousReply';
import { ViewOutputUtils } from '../common/ViewOutputUtils';

export const postAnonymousReplySubmitted: Middleware<SlackViewMiddlewareArgs<ViewSubmitAction>> = async ({
  ack,
  body,
  view,
  client,
}) => {
  void ack();
  try {
    const utils = new ViewOutputUtils(view);
    const reply = utils.getInputValue(postAnonymousReplyModalInputIds.reply)!.value!;

    const {
      message_ts: messageTs,
      channel: { id },
    } = JSON.parse(view.private_metadata);
    const replyContext: KnownBlock[] = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: reply,
        },
      },
      {
        type: 'context',
        elements: [
          {
            type: 'mrkdwn',
            text: 'This was sent *anonymously*',
          },
        ],
      },
    ];

    await client.chat.postMessage({
      channel: id,
      thread_ts: messageTs,
      blocks: replyContext,
      text: ' ',
    });

    logger.info(`response by ${body.user.name}/${body.user.id}}: ${reply}`);
  } catch (error) {
    const { trigger_id: triggerId } = body as unknown as { [id: string]: string };
    logger.error('Something went wrong trying to post a thread reply: ', error);
    try {
      await client.views.open({
        trigger_id: triggerId,
        view: {
          type: 'modal',
          title: {
            type: 'plain_text',
            text: 'Error',
          },
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `:warning: unable to post question to channel.
                \nWe're not totally sure what happened but this issue has been logged.`,
              },
            },
          ],
        },
      });
    } catch (err) {
      logger.error("Something went really wrong and the error modal couldn't be opened: ", err);
    }
  }
};
