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
const bcrypt = require("bcrypt");
const auth = require("./auth");

const pool = new Pool({
  host: PGHOST,
  user: PGUSER,
  database: PGDATABASE,
  password: PGPASSWORD,
  port: PGPORT,
  sslmode: PGSSLMODE,
  /*
  host: "ep-morning-poetry-33271917.us-east-2.aws.neon.tech",
  user: "fl0user",
  database: "news",
  password: "5n7gTputhyLS",
  port: 5432,
  sslmode: "require",*/
  ssl: {
    rejectUnauthorized: false,
  },
});

const getUsers = async (req, res) => {
  const response = await pool.query("SELECT * FROM users");
  res.status(200).json(response.rows);
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  const response = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  res.json(response.rows);
};

const createUser = async (req, res) => {
  const { username, password } = req.body;
  const hashedPass = await bcrypt.hash(password, 10);
  const response = await pool.query(
    "INSERT INTO users (username, password) VALUES ($1, $2)",
    [username, hashedPass]
  );
  console.log(response);
  res.status(200).json(response);
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
  // console.log(username, " está intentando ingresar con pass: ", password);
  try {
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    // console.log("Linea 62", user.rows[0]);
    if (
      !user ||
      !(await auth.comparePasswords(password, user.rows[0].password))
    ) {
      return res.status(401).send({ message: "Wrong password" });
    }
    const token = auth.generateToken(user);
    // console.log("user: ", user);
    // console.log("envío token: ", token);
    res.send({ token });
  } catch (error) {
    return res.status(401).send({ message: "User not found" });
    //seguramente no existe el usuario
  }
};

const verifyTokens = async (req, res) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  console.log("autorization", req.headers.authorization.replace("Bearer ", ""));

  if (!token) {
    return res.status(403).json({ valid: false });
  }

  const user = auth.verifyToken(token);

  if (user) {
    return res.status(200).json({ valid: true });
  } else {
    return res.status(403).json({ valid: false });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  userLogin,
  verifyTokens,
};
