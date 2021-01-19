import { getOsEnv, getOsEnvArray } from './common/env';
import { DbNamingStrategy } from './common/namingStrategy';
import config from './config';

export = {
    url: config.db.url,
    type: config.db.type,
    host: config.db.host,
    database: config.db.database,
    username: config.db.username,
    password: config.db.password,
    entities: getOsEnvArray('TYPEORM_ENTITIES'),
    migrations: getOsEnvArray('TYPEORM_MIGRATIONS'),
    namingStrategy: new DbNamingStrategy(),
    cli: {
      migrationsDir: getOsEnv('TYPEORM_MIGRATIONS_DIR'),
      entitiesDir: getOsEnv('TYPEORM_ENTITIES_DIR'),
    },
    logging: false,
    synchronize: false,
}