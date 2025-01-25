require("dotenv").config({ path: "./vars.env" });
const { Pool } = require("pg");

const {
  DB_URI,
  PGDATABASE,
  PGHOST,
  PGPASSWORD,
  PGPORT,
  PGSSLMODE,
  PGUSER,
  DB_HOST,
  DB_USER,
  DB_DB,
  DB_PASSWORD,
  DB_PORT,
  DB_SSLMODE,
} = process.env;

const pool = new Pool({
  host: DB_HOST,
  user: DB_USER,
  database: DB_DB,
  password: DB_PASSWORD,
  port: DB_PORT,
  sslmode: DB_SSLMODE,
  ssl: {
    rejectUnauthorized: true,
    ca: process.env.DB_CA_CERT,
  },
});
