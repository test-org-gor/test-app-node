import winston from 'winston';
import { config } from '../config';

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  config.isProduction
    ? winston.format.json()
    : winston.format.combine(winston.format.colorize(), winston.format.simple())
);

export const logger = winston.createLogger({
  level: config.isTest ? 'error' : config.logLevel,
  format: logFormat,
  transports: [new winston.transports.Console()],
});
