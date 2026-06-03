const express = require("express");
const router = express.Router();
const {
  getAvailableSlots,
  createBooking,
} = require("../controllers/bookingController");

router.get("/:slug/slots", getAvailableSlots);

router.post("/:slug/book", createBooking);

module.exports = router;
