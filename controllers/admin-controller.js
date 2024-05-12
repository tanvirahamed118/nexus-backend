require("dotenv").config();
const AdminModel = require("../models/admin-model");
const bcrypt = require("bcrypt");
const SECRET_KEY = process.env.SECRET_KEY;
const jwt = require("jsonwebtoken");

// Get All Admin
async function getAdmin(req, res) {
  try {
    const data = await AdminModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
}

// Get Single Admin
async function getOneAdmin(req, res) {
  const id = req.params.id;
  const existAdmin = await AdminModel.findOne({ _id: id });
  try {
    if (!existAdmin) {
      res.status(400).json({ message: "Admin Not Found!" });
    } else {
      res.status(200).json(existAdmin);
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Register Admin
async function register(req, res) {
  const { firstname, lastname, email, password, agreement } = req.body;

  const existAdmin = await AdminModel.findOne({ email: email });

  try {
    if (existAdmin) {
      return res.status(404).json({ message: "Email Already Exist" });
    }
    bcrypt.hash(password, 10, async function (err, hash) {
      const newAdmin = new AdminModel({
        firstname,
        lastname,
        email,
        password: hash,
        agreement,
      });
      const token = jwt.sign(
        { email: newAdmin.email, id: newAdmin._id },
        SECRET_KEY
      );
      await newAdmin.save();
      res.status(201).json({
        admin: newAdmin,
        token: "Bearer " + token,
        message: "Registration Successful",
      });
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

// Login Admin
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const existAdmin = await AdminModel.findOne({ email: email });
    if (!existAdmin) {
      return res.status(404).json({ message: "Admin Not Found!" });
    }
    const matchpassword = await bcrypt.compare(password, existAdmin.password);
    if (!matchpassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign(
      { email: existAdmin.email, id: existAdmin._id },
      SECRET_KEY
    );
    res.status(200).json({
      admin: existAdmin,
      token: token,
      message: "Login Successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Login Faild", error: error });
  }
}

// Update admin
async function updateAdmin(req, res) {
  const { firstname, lastname, email, phone, Organization, description } =
    req.body;
  const id = req.params.id;
  const existAdmin = await AdminModel.findOne({ _id: id });
  const file = req?.file?.originalname.split(" ").join("-");
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  try {
    if (existAdmin) {
      const UpdateAdmin = {
        firstname,
        lastname,
        email,
        phone,
        Organization,
        description,
        adminProfile: `${basePath ? `${basePath}${file}` : "null"}`,
      };

      await AdminModel.findByIdAndUpdate(id, UpdateAdmin, {
        new: true,
      });
      res
        .status(200)
        .json({ admin: UpdateAdmin, message: "Update Successful" });
    } else {
      res.status(400).json({ message: "Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: error, message: "Update Failed" });
  }
}

// admin password update
async function updateAdminPassword(req, res) {
  const { password } = req.body;
  const id = req.params.id;
  const existAdmin = await AdminModel.findOne({ _id: id });
  try {
    if (existAdmin) {
      bcrypt.hash(password, 10, async function (err, hash) {
        const updateAdmin = {
          password: hash,
        };
        await AdminModel.findByIdAndUpdate(id, updateAdmin, {
          new: true,
        });
        res.status(200).json({ message: "Password Changed" });
      });
    } else {
      res.status(400).json({ message: "Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Update Failed" });
  }
}

// Delete admin
async function deleteAdmin(req, res) {
  const id = req.params.id;
  let existAdmin = await AdminModel.findOne({ _id: id });
  try {
    if (existAdmin) {
      await AdminModel.findOneAndDelete(id);
      res.status(200).json({ message: "Account Deleted" });
    } else {
      res.status(400).json({ message: "Admin Does Not Exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "Accoount Delete Failed!" });
  }
}

module.exports = {
  getAdmin,
  getOneAdmin,
  register,
  login,
  updateAdmin,
  updateAdminPassword,
  deleteAdmin,
};
