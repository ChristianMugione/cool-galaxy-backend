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
  getInitialData,
  updatePlanet,
} = require("../controllers/controller");

const { authMiddleware, adminAuthMiddleware } = require("../controllers/auth");

router.get("/", (req, res) => {
  res.send("Cool Galaxy Backend");
});

router.post("/login", userLogin);
router.post("/token", verifyTokens);
router.post("/createuser", createUser);

router.use(authMiddleware);

router.get("/initialdata/:id", getInitialData);
router.get("/users/:id", getUserById);
router.get("/planets/:id", getPlanetsByUserId);
router.get("/newplanet/:id", getNewPlanet); //Only for new users!
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);
router.put("/planet/:id", updatePlanet);

router.use(adminAuthMiddleware);

router.get("/users", getUsers);
// router.post("/generate", generateUniverse);

module.exports = router;
