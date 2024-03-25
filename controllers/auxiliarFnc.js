require("dotenv").config({ path: "./vars.env" });
const {
  DATABASE_URL,
  PGDATABASE,
  PGHOST,
  PGPASSWORD,
  PGPORT,
  PGSSLMODE,
  PGUSER,
} = process.env;
const { Pool } = require("pg");

const pool = new Pool({
  host: PGHOST,
  user: PGUSER,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: PGPORT,
  sslmode: PGSSLMODE,
  ssl: false,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
});

const getListOfEmptyPlanets = async () => {
  console.log("Getting list of empty planets");
  try {
    const emptyPlanets = await pool.query(
      "SELECT * FROM planets WHERE owner_id IS NULL"
    );
    // console.log(emptyPlanets.rows);
    return emptyPlanets.rows;
  } catch (err) {
    console.error("Error getting list of empty planets: ", err);
  }
};

const asignPlanetToUser = async (planet, user) => {
  let response = { updatedPlanetInfo: "", updatedUserInfo: "" };
  //on planet info
  try {
    const updatePlanetList = await pool.query(
      "UPDATE planets SET planet_name = 'Unnamed', owner_id = $1 WHERE id = $2",
      [user, planet]
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
