const express = require("express");
const router = express.Router();
const {
  getAdmin,
  getOneAdmin,
  register,
  login,
  updateAdmin,
  updateAdminPassword,
  deleteAdmin,
} = require("../controllers/admin-controller");
const auth = require("../middlewares/auth");
const adminProfile = require("../middlewares/admin-profile");

router.get("/", auth, getAdmin);
router.get("/:id", auth, getOneAdmin);
router.post("/register", register);
router.post("/login", login);
router.patch("/:id", auth, adminProfile, updateAdmin);
router.patch("/password/:id", auth, updateAdminPassword);
router.delete("/:id", auth, deleteAdmin);

module.exports = router;
