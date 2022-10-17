const router = require("express").Router();
const {
  registerController,
  loginController,
} = require("../controllers/authControllers");

router.post("/register", registerController).post("/login", loginController);

module.exports = router;
