import * as winston from 'winston';

// If `LOG_LEVEL` is not specified, default to `debug` for non-production or `warning` for production
const level = process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'warning' : 'debug');

const simpleErrorFormat = winston.format((info) => {
  const newInfo = { ...info };
  if (newInfo.level.includes('error')) {
    if (newInfo.stack) {
      const stack = newInfo.stack.split('\n').slice(1).join('\n');

      newInfo.message += `\n${stack}`;
    }

    if (newInfo.data) {
      const data = JSON.stringify(newInfo.data, null, 4)
        .split('\n')
        .map((line) => `    ${line}`)
        .join('\n');
      newInfo.message += `\n${data}`;
    }

    delete newInfo.code;
    delete newInfo.data;
    delete newInfo.stack;
  }

  return newInfo;
});

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.splat(),
    simpleErrorFormat(),
    winston.format.simple(),
  ),
  transports: [new winston.transports.Console({ level })],
  levels: {
    emerg: 0,
    alert: 1,
    crit: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
  },
});

export default logger;
