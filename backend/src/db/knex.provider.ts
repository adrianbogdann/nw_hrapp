import { Provider } from '@nestjs/common';
import knex, { Knex } from 'knex';
import knexConfig from './knexfile';

export const KNEX_CONNECTION = 'KNEX_CONNECTION';

export const knexProvider: Provider = {
  provide: KNEX_CONNECTION,
  useFactory: async (): Promise<Knex> => {
    const environment = process.env.NODE_ENV || 'development';
    const config = (knexConfig as Record<string, Knex.Config>)[environment] || knexConfig;
    const connection = knex(config);
    
    await connection.raw('SELECT 1');
    return connection;
  },
};
