import { App } from '@slack/bolt';
import { ignore } from './ignore';
import { actionIds } from '../constants';

export default function actions(bolt: App): void {
  // Register all action listeners
  bolt.action({ action_id: actionIds.ignore }, ignore);
}
