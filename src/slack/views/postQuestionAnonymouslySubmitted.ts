/* eslint-disable camelcase */
import { Middleware, ViewSubmitAction, SlackViewMiddlewareArgs } from '@slack/bolt';
import logger from '../../logger';
import { ViewOutputUtils } from '../common/ViewOutputUtils';
import { postAnonymousQuestionModalInputIds } from '../blocks/postAnonymousQuestion';

export const postQuestionAnonymouslySubmitted: Middleware<SlackViewMiddlewareArgs<ViewSubmitAction>> = async ({
  ack,
  body,
  view,
  client,
}) => {
  void ack();
  try {
    const utils = new ViewOutputUtils(view);

    const channel = utils.getInputValue(postAnonymousQuestionModalInputIds.channelId)!.selected_channel!;
    const question = utils.getInputValue(postAnonymousQuestionModalInputIds.question)!.value!;

    const text = `*_Someone has a question they'd like to ask!_* :thought_balloon: \n>${question}
If you can answer this question, post a response in a thread!`;

    await client.chat.postMessage({
      channel,
      text,
    });

    logger.info(`Question asked by ${body.user.name}/${body.user.id}: ${question}`);
  } catch (error) {
    // Fix after Bolt 3.4
    const { trigger_id: triggerId } = body as unknown as { [id: string]: string };
    logger.error('Something went wrong trying to post to a channel: ', error);
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
      logger.error("Something went really wrong and the error modal couldn't be opened");
    }
  }
};
