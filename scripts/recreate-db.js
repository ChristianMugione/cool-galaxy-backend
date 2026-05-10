require("dotenv").config({ path: "./vars.env" });
const { Pool } = require("pg");

const CAN_RUN = false;

const host = process.env.DB_HOST;
const user = process.env.DB_USER;
const database = process.env.DB_DB;
const password = process.env.DB_PASSWORD;
const port = process.env.DB_PORT;
const sslMode = process.env.DB_SSLMODE;

console.log(host, user, database, password, port, sslMode);

const pool = new Pool({
  host,
  user,
  database,
  password,
  port,
  sslmode: sslMode,
  ssl:
    sslMode && sslMode !== "disable"
      ? {
          rejectUnauthorized: true,
          ca: process.env.DB_CA_CERT,
        }
      : false,
});

const tables = [
  "planets_backup",
  "fleets",
  "constructions",
  "cargo_ships",
  "solar_systems",
  "planets",
  "users",
];

const schemaStatements = [
  'CREATE EXTENSION IF NOT EXISTS "pgcrypto"',
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    planets INTEGER[] NOT NULL DEFAULT '{}'::INTEGER[]
  )`,
  `CREATE TABLE IF NOT EXISTS planets (
    id SERIAL PRIMARY KEY,
    planet_name TEXT NOT NULL DEFAULT '',
    owner_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    population INTEGER NOT NULL DEFAULT 0,
    houses INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS solar_systems (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL DEFAULT '',
    planet_list INTEGER[] NOT NULL DEFAULT '{}'::INTEGER[]
  )`,
  `CREATE TABLE IF NOT EXISTS cargo_ships (
    id SERIAL PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::JSONB
  )`,
  `CREATE TABLE IF NOT EXISTS constructions (
    id SERIAL PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::JSONB
  )`,
  `CREATE TABLE IF NOT EXISTS fleets (
    id SERIAL PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::JSONB
  )`,
  `CREATE TABLE IF NOT EXISTS planets_backup (
    id SERIAL PRIMARY KEY,
    data JSONB NOT NULL DEFAULT '{}'::JSONB
  )`,
];

const recreateDatabase = async () => {
  if (!host || !user || !database || !port) {
    throw new Error(
      "Missing PostgreSQL connection settings. Check PGHOST, PGUSER, PGDATABASE and PGPORT in vars.env."
    );
  }

  console.log(`Recreating schema in ${database}...`);

  for (const table of tables) {
    await pool.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
  }

  for (const statement of schemaStatements) {
    await pool.query(statement);
  }

  console.log("Database schema recreated successfully.");
};


if (CAN_RUN) {
  recreateDatabase()
    .catch((error) => {
      console.error("Failed to recreate the database schema:", error);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
} else {
  console.log("Database recreation is disabled. Set CAN_RUN to true to enable it.");
}