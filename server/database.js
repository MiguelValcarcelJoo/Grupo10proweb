import { Sequelize } from 'sequelize';

const {
  DATABASE_URL,
  DB_HOST,
  DB_PORT = '5432',
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_SSL = 'true',
  DB_LOGGING = 'false',
} = process.env;

const hasConnectionString = Boolean(DATABASE_URL);
const hasDiscreteConfig = [DB_HOST, DB_NAME, DB_USER, DB_PASSWORD].every(Boolean);

export const isDatabaseConfigured = hasConnectionString || hasDiscreteConfig;

const sslEnabled = DB_SSL !== 'false';
const loggingEnabled = DB_LOGGING === 'true';

const commonOptions = {
  dialect: 'postgres',
  logging: loggingEnabled ? console.log : false,
  dialectOptions: sslEnabled ? {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  } : {},
};

export const sequelize = isDatabaseConfigured
  ? (hasConnectionString
    ? new Sequelize(DATABASE_URL, commonOptions)
    : new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_HOST,
        port: Number(DB_PORT),
        ...commonOptions,
      }))
  : null;

export const getStorageMode = () => (isDatabaseConfigured ? 'postgres' : 'memory');

export const initializeDatabase = async () => {
  if (!sequelize) {
    return { connected: false, mode: 'memory' };
  }

  await sequelize.authenticate();
  return { connected: true, mode: 'postgres' };
};
