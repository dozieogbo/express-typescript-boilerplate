import { Connection, createConnection } from 'typeorm';
import config from '../config';
import { Logger } from '../lib/logger';

const log = new Logger(__filename);
const options: any = {};

if (config.db.url) {
  options.url = config.db.url;
} else {
  options.host = config.db.host;
  options.type = config.db.type;
  options.database = config.db.database;
  options.username = config.db.username;
  options.password = config.db.password;
}

export const createDatabaseConnection = async (): Promise<Connection> => {
  const connection = await createConnection({
    ...options,
    migrations: [__dirname + 'src/data/migrations/**/*.ts'],
    entities: [__dirname + 'src/models/entities/**/*.ts'],
    synchronize: true,
    logging: true,
  });

  log.info(`Connected to ${connection.options.type} database`);

  return connection;
};

export const synchronizeDatabase = async (connection: Connection) => {
  return connection.synchronize(true);
};

export const migrateDatabase = async (connection: Connection) => {
  return connection.runMigrations();
};

export const closeDatabase = (connection: Connection) => {
  return connection.close();
};
