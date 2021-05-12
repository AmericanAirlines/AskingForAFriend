/* eslint-disable camelcase */
import { Middleware, ViewSubmitAction, SlackViewMiddlewareArgs } from '@slack/bolt';
import { InputBlock, KnownBlock } from '@slack/types';
import logger from '../../logger';
import { app } from '../../app';
import { env } from '../../env';

export const postAnonymousReplySubmitted: Middleware<SlackViewMiddlewareArgs<ViewSubmitAction>> = async ({
  ack,
  body,
  view,
}) => {
  ack();
  try {
    const { blocks, state, private_metadata } = view;
    const replyBlockId = (blocks[0] as InputBlock).block_id;
    const replyActionId = (blocks[0] as InputBlock).element.action_id;

    const reply = state.values[replyBlockId][replyActionId].value;
    const {
      message_ts,
      channel: { id },
    } = JSON.parse(private_metadata);
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
            text: 'This was sent *anonymously* and may not be the original poster',
          },
        ],
      },
    ];

    await app.client.chat.postMessage({
      token: env.slackToken,
      channel: id,
      thread_ts: message_ts,
      blocks: replyContext,
      text: ' ',
    });

    logger.info(`response by ${body.user.name}/${body.user.id}}: ${reply}`);
  } catch (error) {
    const { trigger_id } = (body as unknown) as { [id: string]: string };
    logger.error('Something went wrong trying to post to a channel: ', error);
    try {
      await app.client.views.open({
        trigger_id,
        token: env.slackToken,
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
