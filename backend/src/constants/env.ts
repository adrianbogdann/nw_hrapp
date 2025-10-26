export const ENV = {
  DATABASE_URL: process.env.DATABASE_URL || "postgres://postgres:postgres@db:5432/hrapp",
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  JWT_SECRET: process.env.JWT_SECRET || "replace_me",
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY || ""
}
