const express = require("express");
const router = express.Router();
const {
  getUser,
  getOneUser,
  register,
  login,
  otpSend,
  otpCheck,
  changePassword,
  updateUserPassword,
  deleteUser,
  updateUser,
  updateUserStatus,
  deleteUserByAdmin,
  updateUserDescription,
} = require("../controllers/user-controller");
const auth = require("../middlewares/auth");
const userFiles = require("../middlewares/userFiles");

router.get("/", getUser);
router.get("/:id", auth, getOneUser);
router.post("/register", userFiles, register);
router.post("/login", login);
router.post("/otp", otpSend);
router.post("/otp/check", otpCheck);
router.post("/reset/change", changePassword);
router.patch("/:id", auth, userFiles, updateUser);
router.patch("/password/:id", auth, updateUserPassword);
router.delete("/:id", auth, deleteUser);
router.delete("/by/:id", auth, deleteUserByAdmin);
router.patch("/status/:id", auth, updateUserStatus);
router.patch("/description/:id", auth, updateUserDescription);

module.exports = router;
