import knex from "knex";
// eslint-disable-next-line @typescript-eslint/no-var-requires
import config from './knexfile';


const env = process.env.NODE_ENV || "development";
export const db = knex(config);
