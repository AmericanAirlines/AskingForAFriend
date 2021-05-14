/* eslint-disable  import/no-cycle */
import { App } from '@slack/bolt';
import { callbackIds } from '../constants';
import { postAnonymousReplySubmitted } from './postAnonymousReplySubmitted';
import { postQuestionAnonymouslySubmitted } from './postQuestionAnonymouslySubmitted';

export default function actions(bolt: App): void {
  // Register all action listeners
  bolt.view(callbackIds.postQuestionAnonymouslySubmitted, postQuestionAnonymouslySubmitted);
  bolt.view(callbackIds.postReplyAnonymouslySubmitted, postAnonymousReplySubmitted);
}
