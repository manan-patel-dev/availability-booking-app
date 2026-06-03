const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  generateBookingLink,
  getBookingLink,
} = require("../controllers/bookingLinkController");

router.post("/generate", authMiddleware, generateBookingLink);

router.get("/:slug", getBookingLink);

module.exports = router;
