require("dotenv").config({ path: "./vars.env" });
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
const { Pool } = require("pg");

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

const getListOfEmptyPlanets = async () => {
  console.log("Getting list of empty planets");
  try {
    const emptyPlanets = await pool.query(
      "SELECT * FROM planets WHERE owner_id IS NULL"
    );
    console.log(emptyPlanets.rows);
    return emptyPlanets.rows;
  } catch (err) {
    console.error("Error getting list of empty planets: ", err);
  }
};

//-----------------------------------------------------------------------------------
const asignPlanetToUser = async (planet, user) => {
  let response = { updatedPlanetInfo: "", updatedUserInfo: "" };
  //on planet info
  try {
    const newPlanetName = `Planet of ${user}`;
    const updatePlanetList = await pool.query(
      "UPDATE planets SET planet_name = $1, owner_id = $2, population = 100, houses= 25 WHERE id = $3",
      [newPlanetName, user, planet]
    );
    response = { ...response, updatedPlanetInfo: "Ok" };
  } catch (err) {
    console.error("Error updating planet info with owner id", err);
    response = { ...response, updatedPlanetInfo: "Error" };
  }
  //and on planet list in user info
  try {
    const updateUserPlanets = await pool.query(
      "UPDATE users SET planets = array_append(planets, $1) WHERE id = $2",
      [planet, user]
    );
    // console.log(updateUserPlanets);
    response = { ...response, updatedUserInfo: "Ok" };
  } catch (err) {
    console.error("Error updating planet list in user register");
    response = { ...response, updatedUserInfo: "Error" };
  }
  return response;
};

module.exports = { getListOfEmptyPlanets, asignPlanetToUser };
