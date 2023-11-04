import { config } from 'dotenv';
import setEnv from '@americanairlines/simple-env';

config();

export const env = setEnv({
  optional: {
    nodeEnv: 'NODE_ENV',
    port: 'PORT',
    logLevel: 'LOG_LEVEL',
    slackLogLevel: 'SLACK_LOG_LEVEL',
  },
  required: {
    slackToken: 'SLACK_BOT_TOKEN',
    slackSigningSecret: 'SLACK_SIGNING_SECRET',
  },
});
