import { App } from '@slack/bolt';
import { callbackIds } from '../constants';
import { postAnonymousQuestion } from './postAnonymousQuestion';

export default function actions(bolt: App): void {
  // Register all action listeners
  bolt.shortcut(callbackIds.postAnonymousQuestion, postAnonymousQuestion);
}
