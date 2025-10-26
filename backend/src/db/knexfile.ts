import type { Knex } from "knex";
import { ENV } from '../constants/env'

// only 1 env here for now - DEV
const config: Knex.Config = {
    client: "pg",
    connection: {
      host: ENV.DB_HOST,
      user: ENV.DB_USER,
      password: ENV.DB_PASSWORD,
      database: ENV.DB_NAME,
    },
    migrations: {
      directory: "./migrations", // relative to /app/dist/db
      extension: "ts"
    },
    seeds: {
      directory: "./seeds", //relative to /app/dist/db
      extension: "ts"
    }
};

export default config;
