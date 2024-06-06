require("dotenv").config();
const UserModel = require("../models/user-model");
const OtpModels = require("../models/otp-model");
const bcrypt = require("bcrypt");
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const SECRET_KEY = process.env.SECRET_KEY;
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const jwt = require("jsonwebtoken");

// Get All User
async function getUser(req, res) {
  try {
    const data = await UserModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
}

// Get Single User
async function getOneUser(req, res) {
  const id = req.params.id;
  const existEmployee = await UserModel.findOne({ _id: id });
  try {
    if (!existEmployee) {
      res.status(400).json({ message: "Employee Not Found" });
    } else {
      res.status(200).json(existEmployee);
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Register User
async function register(req, res) {
  const {
    firstname,
    lastname,
    username,
    email,
    password,
    country,
    instagram,
    agreement,
    tiktok,
    youtube,
    snapchat,
    facebook,
    phone,
  } = req.body;
  const status = "pending";
  const emailUser = await UserModel.findOne({ email: email });
  const usernameUser = await UserModel.findOne({ username: username });
  const profile = req?.files?.profile[0]?.originalname.split(" ").join("-");
  const video = req?.files.video[0]?.originalname?.split(" ")?.join("-");
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  try {
    if (emailUser) {
      return res.status(404).json({ message: "Email Already Exist" });
    }
    if (usernameUser) {
      return res.status(404).json({ message: "Username Already Exist" });
    }
    bcrypt.hash(password, 10, async function (err, hash) {
      const newUser = new UserModel({
        firstname,
        lastname,
        username,
        email,
        phone: Number(phone),
        password: hash,
        country,
        instagram,
        agreement,
        tiktok: tiktok ? tiktok : "",
        youtube: youtube ? youtube : "",
        snapchat: snapchat ? snapchat : "",
        facebook: facebook ? facebook : "",
        profile: `${basePath ? `${basePath}${profile}` : "null"}`,
        video: `${basePath ? `${basePath}${video}` : "null"}`,
        status,
      });
      const token = jwt.sign(
        { email: newUser.email, id: newUser._id },
        SECRET_KEY
      );

      await newUser.save();
      res.status(201).json({
        user: newUser,
        token: "Bearer " + token,
        message: "Registration Successful, waiting for approval",
      });
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

// Login User
async function login(req, res) {
  const { info, password } = req.body;
  const existUser = await UserModel.findOne({
    $or: [{ username: info }, { email: info }],
  });
  try {
    if (!existUser) {
      return res.status(404).json({ message: "User Not Found" });
    }
    if (existUser?.status.toLowerCase() === "pending") {
      return res.status(404).json({ message: "Your Account is Pending" });
    }
    const matchpassword = await bcrypt.compare(password, existUser.password);
    if (!matchpassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign(
      { email: existUser.email, id: existUser._id },
      SECRET_KEY
    );
    res.status(200).json({
      user: existUser,
      token: token,
      message: "Login Successful",
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

// OTP Send
async function otpSend(req, res) {
  const { email } = req.body;

  try {
    const existUser = await UserModel.findOne({ email: email });
    if (existUser) {
      let otp = Math.floor(Math.random() * 10000 + 1);
      let otpData = new OtpModels({
        email,
        code: otp,
        expireIn: new Date().getTime() + 300 * 1000,
      });
      await otpData.save();

      let config = {
        service: "gmail",
        auth: {
          user: EMAIL,
          pass: PASSWORD,
        },
      };
      let transport = nodemailer.createTransport(config);
      let mailGenarator = new Mailgen({
        theme: "default",
        product: {
          name: "name",
          link: "https://name.com",
        },
      });
      let response = {
        body: {
          name: existUser?.email,
          intro: "Reset your password",
          table: {
            data: [
              {
                Message: `your otp is ${otp}`,
              },
            ],
          },
          outro: "Thank You",
        },
      };
      let mail = await mailGenarator.generate(response);
      let message = {
        from: EMAIL,
        to: req.body.email,
        subject: "Reset Password",
        html: mail,
      };
      transport.sendMail(message).then(() => {
        return res.status(200).json({ email: email, message: "OTP Send" });
      });
    } else {
      res.status(400).json({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// OTP Check
async function otpCheck(req, res) {
  try {
    const data = await OtpModels.findOne({ code: req.body.code });

    if (data) {
      let currentTime = new Date().getTime();
      let diffrenceTime = data.expireIn - currentTime;
      if (diffrenceTime < 0) {
        res.status(500).json({ message: "Token Expired" });
      } else {
        res.status(200).json({ message: "OTP Matched" });
      }
    } else {
      res.status(500).json({ message: "OTP Does Not Match" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Change Password
async function changePassword(req, res) {
  const { email, password } = req.body;
  let user = await UserModel.findOne({ email });

  try {
    if (user) {
      bcrypt.hash(password, 10, async function (err, hash) {
        user.password = hash;
        await user.save();
        res.status(200).json({ message: "Password Changed" });
      });
    } else {
      res.status(400).json({ message: "User Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Update User
async function updateUser(req, res) {
  const {
    firstname,
    lastname,
    username,
    email,
    phone,
    country,
    instagram,
    tiktok,
    youtube,
    snapchat,
    facebook,
    agreement,
    bio,
    status,
  } = req.body;

  const id = req.params.id;
  const existUser = await UserModel.findOne({ _id: id });
  const profile = req?.files?.profile[0]?.originalname.split(" ").join("-");
  const video =
    req?.files?.video &&
    req?.files?.video[0]?.originalname.split(" ").join("-");
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;

  try {
    if (existUser) {
      const updateUser = {
        firstname,
        lastname,
        username,
        email,
        phone,
        country,
        instagram,
        tiktok,
        youtube,
        snapchat,
        facebook,
        agreement,
        bio,
        status,
        profile: profile ? `${basePath}${profile}` : existUser?.profile,
        video: video ? `${basePath}${video}` : existUser?.video,
      };

      await UserModel.findByIdAndUpdate(id, updateUser, {
        new: true,
      });
      res.status(200).json({ user: updateUser, message: "Update Successful" });
    } else {
      res.status(400).json({ message: "Not Found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// User password update
async function updateUserPassword(req, res) {
  const { password, oldPassword } = req.body;
  const id = req.params.id;

  const existUser = await UserModel.findOne({ _id: id });

  try {
    const matchpassword = await bcrypt.compare(oldPassword, existUser.password);
    if (!matchpassword) {
      return res
        .status(400)
        .json({ message: "Current Password Does Not Match" });
    }
    if (existUser) {
      bcrypt.hash(password, 10, async function (err, hash) {
        const updateEmployee = {
          password: hash,
        };
        await UserModel.findByIdAndUpdate(id, updateEmployee, {
          new: true,
        });
        res.status(200).json({ message: "Update Successful" });
      });
    } else {
      res.status(400).json({ message: "Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Update Failed" });
  }
}

// Delete User
async function deleteUser(req, res) {
  const id = req.params.id;
  const { password } = req.body;
  let existUser = await UserModel.findOne({ _id: id });
  try {
    const matchpassword = await bcrypt.compare(password, existUser.password);
    if (!matchpassword) {
      return res.status(400).json({ message: "Password Incorrect!" });
    }
    if (existUser) {
      await UserModel.findOneAndDelete(id);
      res.status(200).json({ message: "Account Deleted" });
    } else {
      res.status(400).json({ message: "Employee Does Not Exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "Accoount Delete Failed!" });
  }
}

// Delete User by admin
async function deleteUserByAdmin(req, res) {
  const id = req.params.id;

  let existUser = await UserModel.findOne({ _id: id });
  try {
    if (existUser) {
      await UserModel.findOneAndDelete(id);
      res.status(200).json({ message: "Account Deleted" });
    } else {
      res.status(400).json({ message: "Employee Does Not Exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "Accoount Delete Failed!" });
  }
}

// update User status
async function updateUserStatus(req, res) {
  const { status } = req.body;
  const id = req.params.id;
  const existUser = await UserModel.findOne({ _id: id });
  try {
    if (existUser) {
      const updateUser = {
        status,
      };

      await UserModel.findByIdAndUpdate(id, updateUser, {
        new: true,
      });
      res.status(200).json({ user: updateUser, message: `Account ${status}` });
    } else {
      res.status(400).json({ message: "User Not Found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = {
  getUser,
  getOneUser,
  register,
  login,
  otpCheck,
  otpSend,
  changePassword,
  updateUser,
  updateUserPassword,
  deleteUser,
  updateUserStatus,
  deleteUserByAdmin,
};
