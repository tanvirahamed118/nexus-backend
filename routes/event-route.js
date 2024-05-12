const express = require("express");
const router = express.Router();
const {
  getAllEvent,
  getSingleEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} = require("../controllers/event-controller");
const auth = require("../middlewares/auth");
const thumbnail = require("../middlewares/thumbnail");

router.get("/", getAllEvent);
router.get("/:id", getSingleEvent);
router.post("/", thumbnail, createEvent);
router.patch("/:id", auth, thumbnail, updateEvent);
router.delete("/:id", auth, deleteEvent);

module.exports = router;
