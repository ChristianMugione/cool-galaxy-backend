const { Router } = require("express");
const router = Router();
const {
  getUsers,
  createUser,
  getUserById,
  deleteUser,
  updateUser,
  userLogin,
  verifyTokens,
} = require("../controllers/controller");
const { authMiddleware } = require("../controllers/auth");

router.post("/login", userLogin);
router.post("/token", verifyTokens);

router.use(authMiddleware);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);

module.exports = router;
