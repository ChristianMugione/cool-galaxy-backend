const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config({ path: "./vars.env" });

const secretKey = process.env.SECRET_KEY;

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.rows[0].id,
      username: user.rows[0].username,
    },
    secretKey,
    { expiresIn: "30d" }
  );
};

const verifyToken = (token) => {
  try {
    const tokenVerified = jwt.verify(token, secretKey);

    return tokenVerified;
  } catch (error) {
    console.error("VerifyToken error: ", error);

    return null;
  }
};

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Acceso no autorizado. Token no proporcionado." });
  }

  try {
    const user = verifyToken(token);

    req.user = user;

    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Acceso no autorizado. Token inválido." });
  }
};

const adminAuthMiddleware = (req, res, next) => {
  const userId = req.user.userId;

  if (userId !== 1) {
    return res.status(401).json({ message: "Only admins" });
  }

  next();
};

// AUXILIAR FUNCTIONS

const comparePasswords = async (inputPass, hashedPass) => {
  return await bcrypt.compare(inputPass, hashedPass);
};

module.exports = {
  generateToken,
  verifyToken,
  comparePasswords,
  authMiddleware,
  adminAuthMiddleware,
};
