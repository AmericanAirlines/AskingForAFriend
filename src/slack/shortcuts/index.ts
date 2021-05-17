import { App } from '@slack/bolt';
import { callbackIds } from '../constants';
import { postAnonymousQuestion } from './postAnonymousQuestion';
import { postAnonymousReply } from './postAnonymousReply';

export default function shortcuts(bolt: App): void {
  // Register all action listeners
  bolt.shortcut(callbackIds.postAnonymousQuestion, postAnonymousQuestion);
  bolt.shortcut(callbackIds.postAnonymousReply, postAnonymousReply);
}
