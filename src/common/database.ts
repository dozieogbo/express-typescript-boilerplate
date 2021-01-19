import { Connection, createConnection } from 'typeorm';
import config from '../config';
import { Logger } from './logger';
import { DbNamingStrategy } from './namingStrategy';

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
  const connection = await createConnection(
    Object.assign(options, {
      migrations: config.app.dirs.migrations,
      entities: config.app.dirs.entities,
      synchronize: false,
      logging: false,
      cli: {
        migrationsDir: config.app.dirs.migrationsDir,
        entitiesDir: config.app.dirs.entitiesDir,
      },
      namingStrategy: new DbNamingStrategy(),
    }),
  );

  log.info(`Connected to ${connection.options.type} database`);

  return connection;
};

export const synchronizeDatabase = async (connection: Connection) => {
  return connection.synchronize(true);
};

export const migrateDatabase = async (connection: Connection) => {
  log.info(`Processing ${connection.migrations.length} database migrations`);

  const migrations = await connection.runMigrations();

  log.info(`Executed ${migrations.length} database migrations`);

  return migrations;
};

export const closeDatabase = (connection: Connection) => {
  return connection.close();
};

export const initialize = async () => {
  const connection = await createDatabaseConnection();

  await migrateDatabase(connection);
};

export default {
  createDatabaseConnection,
  synchronizeDatabase,
  migrateDatabase,
  closeDatabase,
  initialize,
};
