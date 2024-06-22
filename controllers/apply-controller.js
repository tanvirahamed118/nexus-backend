const ApplyModel = require("../models/apply-model");

// get all apply
async function getAllApply(req, res) {
  try {
    const events = await ApplyModel.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json(error);
  }
}

// get single apply
async function getSingleEvent(req, res) {
  const id = req?.params?.id;
  try {
    const existApply = await ApplyModel.findOne({ _id: id });
    if (existApply) {
      res.status(200).json(existApply);
    } else {
      res.status(400).json({ message: "Event Not found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// create apply
async function createApply(req, res) {
  const { date, time, message, eventID, eventTitle, status, eventPic } =
    req.body;

  try {
    const newApply = new ApplyModel({
      date,
      time,
      message,
      eventID,
      eventTitle,
      status,
      eventPic,
    });
    await newApply.save();
    res.status(200).json({ apply: newApply, message: "Apply Successful" });
  } catch (error) {
    res.status(500).json(error);
  }
}

// update apply
async function updateApply(req, res) {
  const id = req.params.id;
  const { date, time, message, status } = req.body;

  const existApply = await ApplyModel.findOne({ _id: id });

  try {
    if (existApply) {
      const updateApply = {
        date,
        time,
        message,
        status,
      };
      await ApplyModel.findByIdAndUpdate(id, updateApply, {
        new: true,
      });
      res
        .status(200)
        .json({ apply: updateApply, message: "Update Successful" });
    } else {
      res.status(400).json({ message: "Data Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// update submisssion apply
async function updateSubmissionApply(req, res) {
  const id = req.params.id;
  const file = req?.file?.originalname.split(" ").join("-");
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  const existApply = await ApplyModel.findOne({ _id: id });

  try {
    if (existApply) {
      const updateApply = {
        profile: `${basePath ? `${basePath}${file}` : "null"}`,
      };
      await ApplyModel.findByIdAndUpdate(id, updateApply, {
        new: true,
      });
      res
        .status(200)
        .json({ apply: updateApply, message: "Submission Successful" });
    } else {
      res.status(400).json({ message: "Data Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// delete apply
async function deleteApply(req, res) {
  const id = req.params.id;
  let existApply = await ApplyModel.findOne({ _id: id });
  try {
    if (existApply) {
      await ApplyModel.findByIdAndDelete(id);
      res.status(200).json({ message: "Delete Successful" });
    } else {
      res.status(400).json({ message: "Data Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Delete Failed!" });
  }
}

module.exports = {
  getAllApply,
  getSingleEvent,
  createApply,
  updateApply,
  deleteApply,
  updateSubmissionApply,
};
