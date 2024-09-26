require("./configs/DB-connection");
const express = require("express");
const app = express();
const cors = require("cors");
const auth = require("./middlewares/auth");
const userRoute = require("./routes/user-route");
const adminRoute = require("./routes/admin-route");
const eventRoute = require("./routes/event-route");
const applyRoute = require("./routes/apply-route");
const messageRouter = require("./routes/contact-route");
const brandRouter = require("./routes/brand-route");
const path = require("path");

// App Use Middlewares
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));
app.use(
  "/public/uploads",
  express.static(path.join(__dirname, "public/uploads"))
);
app.use(
  cors({
    origin: `${process.env.CORS_URL}`,
  })
);

// All Routes
// user Route
app.use("/auth/user", userRoute);

// admin Route
app.use("/auth/admin", adminRoute);

// admin Route
app.use("/auth/event", eventRoute);

// admin Route
app.use("/auth/apply", applyRoute);

// Message Route
app.use("/auth/message", messageRouter);

// Message Route
app.use("/auth/brand", brandRouter);

// Home Route
app.get("/", auth, (req, res) => {
  res.send("Home Route");
});

// Route not founf
app.use((req, res, next) => {
  res.send("Route Not Found");
  next();
});

// Server error
app.use((req, res, next, err) => {
  if (err) {
    return err;
  } else {
    res.send("Server Error");
  }
  next();
});

module.exports = app;
