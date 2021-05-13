/* eslint-disable camelcase */
import { Middleware, ViewSubmitAction, SlackViewMiddlewareArgs } from '@slack/bolt';
import { InputBlock } from '@slack/types';
import logger from '../../logger';
import { app } from '../../app';
import { env } from '../../env';

export const postQuestionAnonymouslySubmitted: Middleware<SlackViewMiddlewareArgs<ViewSubmitAction>> = async ({
  ack,
  body,
  view,
}) => {
  try {
    const { blocks, state } = view;
    const channelSelectBlockId = (blocks[0] as InputBlock).block_id;
    const channelSelectActionId = (blocks[0] as InputBlock).element.action_id;
    const questionBlockId = (blocks[1] as InputBlock).block_id;
    const questionActionId = (blocks[1] as InputBlock).element.action_id;

    const channel = state.values[channelSelectBlockId][channelSelectActionId].selected_channel;
    const question = state.values[questionBlockId][questionActionId].value;

    const text = `*_Someone has a question they'd like to ask!_* :thought_balloon: \n>${question}
If you can answer this question, post a response in a thread!`;
    ack();

    await app.client.chat.postMessage({
      token: env.slackToken,
      channel,
      text,
    });

    await app.client.chat.postEphemeral({
      token: env.slackToken,
      channel,
      user: body.user.id,
      text: `:warning: You won't be notified automatically when someone replies to this question. To get notifications from replies, follow the thread:
      :one: Hover over the message (mobile app: tap the message)
      :two: Click message options (three dots)
      :three: Select \`Follow thread\``,
    });

    logger.info(`Question asked by ${body.user.name}/${body.user.id}: ${question}`);
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
      logger.error("Something went really wrong and the error modal couldn't be opened");
    }
  }
};
