const router = require("express").Router();
const verifyToken = require("../middlewares/verifyToken");
const {
  getAllNote,
  noteCreate,
  noteUpdate,
  noteDelete,
} = require("../controllers/noteControllers");

router
  .get("/", verifyToken, getAllNote)
  .post("/create", verifyToken, noteCreate)
  .patch("/update", verifyToken, noteUpdate)
  .delete("/delete/:id", verifyToken, noteDelete);

module.exports = router;
