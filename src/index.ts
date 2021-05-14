import { app, init } from './app';
import { env } from './env';
import logger from './logger';

export const port = parseInt(env.port || '3000', 10);
async function start(): Promise<void> {
  await init();
  await app.start(port);
  logger.info(`Listening on port ${port} in the ${env.nodeEnv || 'development'} environment`);
}

// Start the app
start().catch((err) => {
  logger.error('Something went wrong starting the app: ', err);
  process.exit(1);
});
