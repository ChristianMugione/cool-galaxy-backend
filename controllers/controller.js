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
const bcrypt = require("bcryptjs");
const auth = require("./auth");
const { getListOfEmptyPlanets, asignPlanetToUser } = require("./auxiliarFnc");

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

const generateUniverse = async () => {
  console.log("Generate Universe");
  //create SS's
  //create planets
  // console.log("Running generateUniverse");
  // for (let solarsystem = 1; solarsystem < 100; solarsystem++) {
  //   let planetList = [];
  //   for (let planet = 1; planet < 5; planet++) {
  //     const responsePlanet = await pool.query(
  //       "INSERT INTO planets (planet_name, owner_id) VALUES ($1, $2) RETURNING id",
  //       ["", null]
  //     );
  //     console.log("responsePlanet: ", responsePlanet);
  //     planetList.push(responsePlanet.rows[0].id);
  //   }
  //   const response = await pool.query(
  //     "INSERT INTO solar_systems (name, planet_list) VALUES ($1, $2)",
  //     ["", planetList]
  //   );
  //   console.log("response: ", response);
  // }
};

const getUsers = async (req, res) => {
  try {
    const response = await pool.query("SELECT * FROM users");
    console.log(response.rows);
    res.status(200).json(response.rows);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error });
  }
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  res.json(response.rows);
};

const getPlanetsByUserId = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query("SELECT planets FROM users WHERE id = $1", [
    id,
  ]);
  // console.log("response", response);
  const data = await response.rows;
  // console.log("data", data);
  console.log(data[0].planets);
  res.status(200).json(data[0].planets);
};

const getNewPlanet = async (req, res) => {
  const userId = req.params.id;

  const listOfEmptyPlanets = await getListOfEmptyPlanets();

  //take a random number
  const selectedPlanetId = Math.floor(
    Math.random() * (listOfEmptyPlanets.length + 1)
  );

  const asignPlanetToUserResult = asignPlanetToUser(selectedPlanetId, userId);

  res.status(200).json({
    message: `Planet ${selectedPlanetId} has been assigned to user ${userId}`,
    asignPlanetToUserResult,
  });
  //if list have less than 80 add more planets
  //select random empty planet
  //asign these planet to user
  //return planet id
  //SELECT mi_array[3] FROM mi_tabla WHERE id = 1;
};

const createUser = async (req, res) => {
  const { username, password, mail } = req.body;
  try {
    const hashedPass = await bcrypt.hash(password, 10);
    const response = await pool.query(
      "INSERT INTO users (username, password, email, planets) VALUES ($1, $2, $3, $4)",
      [username, hashedPass, mail, []]
    );
    res.status(200).json(response);
  } catch (err) {
    console.error("Error creating user. Please contact tu hermana");
  }
};

const updateUser = async (req, res) => {
  const { username, password } = req.body;
  const id = req.params.id;
  const response = await pool.query(
    "UPDATE users SET username = $1, password = $2 WHERE id = $3",
    [username, password, id]
  );
  res.status(200).json(response);
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query("DELETE FROM users WHERE id = $1", [id]);
  res.status(200).json(response);
};

const userLogin = async (req, res) => {
  //si existe user chequear pass, si OK devolver status 200 y token
  const { username, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (
      !user ||
      !(await auth.comparePasswords(password, user.rows[0].password))
    ) {
      return res.status(401).send({ message: "Wrong password" });
    }
    const userId = user.rows[0].id;
    const token = auth.generateToken(user);
    res.send({ token, userId });
  } catch (error) {
    return res.status(401).send({ message: "User not found" });
  }
};

const verifyTokens = async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ valid: false });
  }

  const user = auth.verifyToken(token);

  if (user) {
    return res
      .status(200)
      .json({ valid: true, userId: user.userId, username: user.username });
  } else {
    return res.status(403).json({ valid: false });
  }
};

const getInitialData = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await pool.query(
      "SELECT * FROM planets WHERE owner_id = $1",
      [id]
    );
    const data = await response.rows;
    console.log(`Send initial data to user ${id}`);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in getInitialData: ", error);
    res.status(400).json({ error: "Failed getInitialData" });
  }
};

module.exports = {
  generateUniverse,
  getUsers,
  getUserById,
  getPlanetsByUserId,
  getNewPlanet,
  createUser,
  updateUser,
  deleteUser,
  userLogin,
  verifyTokens,
  getInitialData,
};
