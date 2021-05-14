/* eslint-disable  import/no-cycle */
import 'dotenv/config';
import { App, LogLevel, ExpressReceiver, AuthorizeResult } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import api from './api';
import { actions, shortcuts, views } from './slack';
import { env } from './env';

export const receiver = new ExpressReceiver({ signingSecret: env.slackSigningSecret });
let authorizeResult: AuthorizeResult;

let logLevel: LogLevel;
if (env.slackLogLevel) {
  logLevel = env.slackLogLevel as LogLevel;
} else {
  logLevel = env.nodeEnv === 'development' ? LogLevel.DEBUG : LogLevel.INFO;
}

async function authorize(): Promise<AuthorizeResult> {
  // See if we already have the auth result;
  // if so, use that instead of hitting the API again
  if (authorizeResult) {
    return authorizeResult;
  }

  if (env.nodeEnv === 'test') {
    // During testing, avoid hittin the API and use junk data
    authorizeResult = {
      botToken: 'junk test token',
      botId: 'junk bot id',
      botUserId: 'junk bot user id',
    };
    return authorizeResult;
  }

  const botToken = env.slackToken;
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
