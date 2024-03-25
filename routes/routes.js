const { Router } = require("express");

const router = Router();

const {
  getUsers,
  createUser,
  getUserById,
  getPlanetsByUserId,
  getNewPlanet,
  deleteUser,
  updateUser,
  userLogin,
  verifyTokens,
  generateUniverse,
} = require("../controllers/controller");

const { authMiddleware, adminAuthMiddleware } = require("../controllers/auth");

router.get("/", (req, res) => {
  res.send("Backend de Cool Galaxy");
});

router.post("/login", userLogin);
router.post("/token", verifyTokens);
router.post("/createuser", createUser);

router.use(authMiddleware);

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.get("/planets/:id", getPlanetsByUserId);
router.get("/newplanet/:id", getNewPlanet);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);

router.use(adminAuthMiddleware);

router.post("/generate", generateUniverse);

module.exports = router;
