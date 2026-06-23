import winston from 'winston';
import path from 'path';
import { env } from './env';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${ts}] ${level}: ${stack || message}${metaStr}`;
  }),
);

const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json(),
);

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: env.nodeEnv === 'production' ? prodFormat : devFormat,
  }),
];

if (env.nodeEnv === 'production') {
  transports.push(
    new winston.transports.File({
      filename: path.join('logs', 'error.log'),
      level: 'error',
      format: prodFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: path.join('logs', 'combined.log'),
      format: prodFormat,
      maxsize: 10 * 1024 * 1024,
      maxFiles: 10,
    }),
  );
}

export const logger = winston.createLogger({
  level: env.nodeEnv === 'production' ? 'info' : 'debug',
  transports,
  exitOnError: false,
});

// Stream for morgan
export const morganStream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};
