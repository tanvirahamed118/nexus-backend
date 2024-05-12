const express = require("express");
const router = express.Router();
const {
  getAllApply,
  getSingleEvent,
  createApply,
  deleteApply,
  updateApply,
  updateSubmissionApply,
} = require("../controllers/apply-controller");
const auth = require("../middlewares/auth");
const profile = require("../middlewares/profile");

router.get("/", auth, getAllApply);
router.post("/", auth, createApply);
router.get("/:id", auth, getSingleEvent);
router.patch("/:id", auth, updateApply);
router.delete("/:id", auth, deleteApply);
router.patch("/submission/:id", auth, profile, updateSubmissionApply);

module.exports = router;
