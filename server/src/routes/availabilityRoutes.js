const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const { createAvailability } = require("../controllers/availabilityController");

router.post("/", authMiddleware, createAvailability);

module.exports = router;
