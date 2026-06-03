const path = require("path");
const { v4: uuidv4 } = require("uuid");

const { readFile, writeFile } = require("../utils/fileHelper");

const AVAILABILITY_FILE = path.join(
  __dirname,
  "../../storage/availability.json",
);

const createAvailability = (req, res) => {
  try {
    const { date, startTime, endTime } = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const availability = readFile(AVAILABILITY_FILE);

    const newAvailability = {
      id: uuidv4(),
      userId: req.user.id,
      date,
      startTime,
      endTime,
    };

    availability.push(newAvailability);

    writeFile(AVAILABILITY_FILE, availability);

    res.status(201).json(newAvailability);
  } catch (error) {
    console.error("createAvailability error:", error.message || error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createAvailability,
};
