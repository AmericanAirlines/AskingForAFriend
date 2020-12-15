import { env } from '../env';

const mockEnv: typeof env = {
  nodeEnv: process.env.NODE_ENV ?? 'test',
  slackSigningSecret: 'slackSigningSecret',
  slackToken: 'slackToken',
};

export { mockEnv as env };
