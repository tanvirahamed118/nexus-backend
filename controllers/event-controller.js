const EventModel = require("../models/event-model");
const AdminModel = require("../models/admin-model");

// get all event
async function getAllEvent(req, res) {
  try {
    const events = await EventModel.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json(error);
  }
}

// get sing event
async function getSingleEvent(req, res) {
  const id = req?.params?.id;
  try {
    const existEvent = await EventModel.findOne({ _id: id });
    if (existEvent) {
      res.status(200).json(existEvent);
    } else {
      res.status(400).json({ message: "Event not found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// create event
async function createEvent(req, res) {
  const {
    title,
    category,
    conditions,
    description,
    location,
    star,
    requirements,
    adminId,
  } = req.body;

  try {
    const findAdmin = await AdminModel.findOne({ _id: adminId });
    const file = req?.file?.originalname.split(" ").join("-");
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const eventPic = file ? `${basePath}${file}` : null;
    const newEvent = new EventModel({
      title,
      category,
      requirements,
      description,
      location,
      star,
      conditions,
      adminPic: findAdmin?.adminProfile,
      adminName: findAdmin?.firstname + " " + findAdmin?.lastname,
      eventPic: eventPic,
    });
    await newEvent.save();
    res
      .status(200)
      .json({ event: newEvent, message: "Event Create Successful" });
  } catch (error) {
    res.status(500).json(error);
  }
}

// update event
async function updateEvent(req, res) {
  const id = req.params.id;
  const {
    title,
    category,
    conditions,
    description,
    location,
    star,
    requirements,
  } = req.body;
  const existEvent = await EventModel.findOne({ _id: id });
  const file = req?.file?.originalname.split(" ").join("-");
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  const eventPic = file ? `${basePath}${file}` : null;
  try {
    if (existEvent) {
      const updateEvent = {
        title,
        category,
        conditions,
        description,
        location,
        star,
        requirements,
        eventPic: eventPic,
      };

      await EventModel.findByIdAndUpdate(id, updateEvent, {
        new: true,
      });
      res
        .status(200)
        .json({ evebt: updateEvent, message: "Update Successful" });
    } else {
      res.status(400).json({ message: "Event Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: error, message: "Update Failed" });
  }
}

// delete event
async function deleteEvent(req, res) {
  const id = req.params.id;
  let existEvent = await EventModel.findOne({ _id: id });
  try {
    if (existEvent) {
      await EventModel.findByIdAndDelete(id);
      res.status(200).json({ message: "Delete Successful" });
    } else {
      res.status(400).json({ message: "Data Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Delete Failed!" });
  }
}

module.exports = {
  getAllEvent,
  getSingleEvent,
  createEvent,
  updateEvent,
  deleteEvent,
};
