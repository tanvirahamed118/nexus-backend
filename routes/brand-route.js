const express = require("express");
const router = express.Router();
const {
  getAllBrand,
  getSingleBrand,
  createBrand,
  updateBrand,
  deleteBrand,
} = require("../controllers/brand-controller");
const auth = require("../middlewares/auth");

router.get("/", auth, getAllBrand);
router.get("/:id", auth, getSingleBrand);
router.post("/", createBrand);
router.patch("/:id", auth, updateBrand);
router.delete("/:id", auth, deleteBrand);

module.exports = router;
