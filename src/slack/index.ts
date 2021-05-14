import { App } from '@slack/bolt';
import logger from '../logger';
import shortcuts from './shortcuts';
import views from './views';

export const setupSlack = (bolt: App) => {
  bolt.action(/ignore.*/i, async ({ ack }) => {
    logger.debug('Action ignored');
    void ack();
  });

  shortcuts(bolt);
  views(bolt);
};
