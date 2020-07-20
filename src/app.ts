import 'dotenv/config';
import { App, LogLevel, ExpressReceiver, AuthorizeResult } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import getRequiredEnvVar from './utils/getRequiredEnvVar';
import api from './api';
import { actions, shortcuts, views } from './slack';

export const receiver = new ExpressReceiver({ signingSecret: getRequiredEnvVar('SLACK_SIGNING_SECRET') });
let authorizeResult: AuthorizeResult;

let logLevel: LogLevel;
if (process.env.SLACK_LOG_LEVEL) {
  logLevel = process.env.SLACK_LOG_LEVEL as LogLevel;
} else {
  logLevel = process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO;
}

async function authorize(): Promise<AuthorizeResult> {
  // See if we already have the auth result;
  // if so, use that instead of hitting the API again
  if (authorizeResult) {
    return authorizeResult;
  }

  if (process.env.NODE_ENV === 'test') {
    // During testing, avoid hittin the API and use junk data
    authorizeResult = {
      botToken: 'junk test token',
      botId: 'junk bot id',
      botUserId: 'junk bot user id',
    };
    return authorizeResult;
  }

  const botToken = getRequiredEnvVar('SLACK_TOKEN');
  const client = new WebClient(botToken);
  const auth = (await client.auth.test()) as { [id: string]: string };
  authorizeResult = {
    botToken,
    botId: auth.bot_id,
    botUserId: auth.user_id,
  };

  return authorizeResult;
}

// Create a new bolt app using the receiver instance and authorize method above
export const app = new App({
  receiver,
  logLevel,
  authorize,
});

// Initialize /api routes
receiver.app.use('/api', api);

receiver.app.get('/', (_req, res) => {
  res.sendStatus(200);
});

// Generic catch all for unknown routes
receiver.app.use('*', (_req, res) => {
  res.sendStatus(404);
});

// Register Listeners
actions(app);
shortcuts(app);
views(app);

export const init = async (): Promise<void> => {
  // Do any async init stuff
};
