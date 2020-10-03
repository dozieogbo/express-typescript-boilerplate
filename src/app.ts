import 'reflect-metadata';

import { Express } from 'express';
import morgan from 'morgan';
import winston, { format } from 'winston';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import { createExpressServer } from 'routing-controllers';
import config from './config';
import container from './container';
import swaggerDoc from './swagger';
import database from './common/database';

import { Logger } from './common/logger';

/**
 * EXPRESS TYPESCRIPT BOILERPLATE
 * ----------------------------------------
 *
 * This is a boilerplate for Node.js Application written in TypeScript.
 * The basic layer of this app is express. For further information visit
 * the 'README.md' file.
 */
const log = new Logger(__filename);

winston.configure({
  transports: [
    new winston.transports.Console({
      level: config.log.level,
      handleExceptions: true,
      format:
        config.node !== 'development'
          ? format.combine(format.json())
          : format.combine(format.colorize(), format.simple()),
    }),
  ],
});

container.setup();

database.initialize();

const app: Express = createExpressServer({
  controllers: [ __dirname + '/controllers/*.js'],
  middlewares: [__dirname + '/middlewares/*.js'],
  interceptors: [__dirname + '/interceptors/*.js'],
  routePrefix: config.app.routePrefix
});

app.use(
  morgan('dev', {
    stream: {
      write: log.info.bind(log),
    },
  }),
);
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

const server = app.listen(config.app.port || 3000, function () {
  log.info(`Aloha, your app is ready on ${config.app.port}`);
  log.info(`To shut it down, press <CTRL> + C at any time.`);
  log.info(``);
  log.info('-------------------------------------------------------');
});

export default server;
