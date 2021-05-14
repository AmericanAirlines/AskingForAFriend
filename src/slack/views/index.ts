import { App } from '@slack/bolt';
import { callbackIds } from '../constants';
import { postQuestionAnonymouslySubmitted } from './postQuestionAnonymouslySubmitted';

export default function views(bolt: App): void {
  // Register all action listeners
  bolt.view(callbackIds.postQuestionAnonymouslySubmitted, postQuestionAnonymouslySubmitted);
}
