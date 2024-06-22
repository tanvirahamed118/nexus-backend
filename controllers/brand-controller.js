const BrandModel = require("../models/brand-model");

// get all brand
async function getAllBrand(req, res) {
  try {
    const brand = await BrandModel.find();
    res.status(200).json(brand);
  } catch (error) {
    res.status(500).json(error);
  }
}

// get sing brand
async function getSingleBrand(req, res) {
  const id = req?.params?.id;
  try {
    const existBrand = await BrandModel.findOne({ _id: id });
    if (existBrand) {
      res.status(200).json(existBrand);
    } else {
      res.status(400).json({ message: "Brand not found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// create brand
async function createBrand(req, res) {
  const { nameOfEST, RPPersonName, position, email, phone, message } = req.body;

  try {
    const newBrand = new BrandModel({
      nameOfEST,
      RPPersonName,
      position,
      email,
      phone: Number(phone),
      message,
    });
    await newBrand.save();
    res
      .status(200)
      .json({ brand: newBrand, message: "Form Submit Successful" });
  } catch (error) {
    res.status(500).json(error);
  }
}

// update brand
async function updateBrand(req, res) {
  const id = req.params.id;
  const { nameOfEST, RPPersonName, position, email, phone, message } = req.body;
  const existBrand = await BrandModel.findOne({ _id: id });
  try {
    if (existBrand) {
      const updateBrand = {
        nameOfEST,
        RPPersonName,
        position,
        email,
        phone: Number(phone),
        message,
      };

      await BrandModel.findByIdAndUpdate(id, updateBrand, {
        new: true,
      });
      res
        .status(200)
        .json({ brand: updateBrand, message: "Update Successful" });
    } else {
      res.status(400).json({ message: "Brand Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: error, message: "Update Failed" });
  }
}

// delete brand
async function deleteBrand(req, res) {
  const id = req.params.id;
  let existBrand = await BrandModel.findOne({ _id: id });
  try {
    if (existBrand) {
      await BrandModel.findByIdAndDelete(id);
      res.status(200).json({ message: "Delete Successful" });
    } else {
      res.status(400).json({ message: "Data Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Delete Failed!" });
  }
}

module.exports = {
  getAllBrand,
  getSingleBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
