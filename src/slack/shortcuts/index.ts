/* eslint-disable  import/no-cycle */
import { App } from '@slack/bolt';
import { callbackIds } from '../constants';
import { postAnonymousQuestion } from './postAnonymousQuestion';
import { postReplyAnonymously } from './postReplyAnonymously';

export default function actions(bolt: App): void {
  // Register all action listeners
  bolt.shortcut(callbackIds.postAnonymousQuestion, postAnonymousQuestion);
  bolt.shortcut(callbackIds.postReplyAnonymously, postReplyAnonymously);
}
