const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "J^NFJPz&A^n5YP0s";

const generateToken = (user) => {
  // console.log("--- Funcion generateToken, user: ", user.rows[0].id);
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
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.error("Error: ", error);
    return null;
  }
};

const comparePasswords = async (inputPass, hashedPass) => {
  return await bcrypt.compare(inputPass, hashedPass);
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

module.exports = {
  generateToken,
  verifyToken,
  comparePasswords,
  authMiddleware,
};
