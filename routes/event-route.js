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
const eventPic = require("../middlewares/eventPic");

router.get("/", getAllEvent);
router.get("/:id", getSingleEvent);
router.post("/", eventPic, createEvent);
router.patch("/:id", auth, eventPic, updateEvent);
router.delete("/:id", auth, deleteEvent);

module.exports = router;
