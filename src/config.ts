import * as dotenv from 'dotenv';
import * as path from 'path';

import {
  getOsEnv,
  getOsEnvOptional,
  getOsPath,
  getOsPaths,
  normalizePort,
  toBool,
  toNumber,
} from './common/env';

/**
 * Load .env file or for tests the .env.test file.
 */
dotenv.config({
  path: path.join(
    process.cwd(),
    `.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`,
  ),
});

/**
 * Environment variables
 */
export const config = {
  node: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  isDevelopment: process.env.NODE_ENV === 'development',
  app: {
    name: getOsEnv('APP_NAME'),
    host: getOsEnv('APP_HOST'),
    scheme: getOsEnv('APP_SCHEME'),
    routePrefix: getOsEnv('APP_ROUTE_PREFIX'),
    port: normalizePort(process.env.PORT || getOsEnv('APP_PORT')),
    banner: toBool(getOsEnv('APP_BANNER')),
    dirs: {
      migrations: getOsPaths('TYPEORM_MIGRATIONS'),
      migrationsDir: getOsPath('TYPEORM_MIGRATIONS_DIR'),
      entities: getOsPaths('TYPEORM_ENTITIES'),
      entitiesDir: getOsPath('TYPEORM_ENTITIES_DIR'),
      controllers: getOsPaths('CONTROLLERS'),
      middlewares: getOsPaths('MIDDLEWARES'),
      interceptors: getOsPaths('INTERCEPTORS'),
      subscribers: getOsPaths('SUBSCRIBERS'),
      resolvers: getOsPaths('RESOLVERS'),
    },
  },
  mail: {
    sandboxMode: toBool(getOsEnv('MAIL_SANDBOX_MODE')),
    fromEmail: getOsEnv('MAIL_FROM_ADDRESS'),
    fromName: getOsEnv('MAIL_FROM_NAME'),
    sandbox: {
      host: getOsEnv('MAILSPONS_HOST'),
      port: toNumber(getOsEnv('MAILSPONS_PORT')),
      username: getOsEnv('MAILSPONS_USERNAME'),
      password: getOsEnv('MAILSPONS_PASSWORD'),
    },
    sendgrid: {
      apiKey: getOsEnvOptional('SENDGRID_API_KEY'),
    },
    mailgun: {
      apiKey: getOsEnvOptional('MAILGUN_API_KEY'),
      domain: getOsEnvOptional('MAILGUN_DOMAIN'),
    },
  },
  jwt: {
    secretKey: getOsEnv('JWT_SECRET'),
    daysValid: toNumber(getOsEnv('JWT_DAYS_VALIDITY')),
  },
  log: {
    level: getOsEnv('LOG_LEVEL'),
    json: toBool(getOsEnvOptional('LOG_JSON')),
    output: getOsEnv('LOG_OUTPUT'),
  },
  db: {
    url: getOsEnvOptional('TYPEORM_URL'),
    type: getOsEnvOptional('TYPEORM_CONNECTION'),
    host: getOsEnvOptional('TYPEORM_HOST'),
    port: toNumber(getOsEnvOptional('TYPEORM_PORT')),
    username: getOsEnvOptional('TYPEORM_USERNAME'),
    password: getOsEnvOptional('TYPEORM_PASSWORD'),
    database: getOsEnvOptional('TYPEORM_DATABASE'),
  },
  swagger: {
    enabled: toBool(getOsEnv('SWAGGER_ENABLED')),
    route: getOsEnv('SWAGGER_ROUTE'),
    username: getOsEnv('SWAGGER_USERNAME'),
    password: getOsEnv('SWAGGER_PASSWORD'),
  },
  monitor: {
    enabled: toBool(getOsEnv('MONITOR_ENABLED')),
    route: getOsEnv('MONITOR_ROUTE'),
    username: getOsEnv('MONITOR_USERNAME'),
    password: getOsEnv('MONITOR_PASSWORD'),
  },
};

export default config;
