const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  updateController,
  deleteController,
} = require("../controllers/userControllers");

router
  .patch("/update", verifyToken, updateController)
  .delete("/delete", verifyToken, deleteController);

module.exports = router;
