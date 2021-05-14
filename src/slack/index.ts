import { App } from '@slack/bolt';
import actions from './actions';
import shortcuts from './shortcuts';
import views from './views';

export const setupSlack = (bolt: App) => {
  actions(bolt);
  shortcuts(bolt);
  views(bolt);
};
