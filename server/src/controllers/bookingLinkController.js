const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { readFile, writeFile } = require("../utils/fileHelper");

const BOOKING_LINK_FILE = path.join(
  __dirname,
  "../../storage/bookingLinks.json",
);

const generateBookingLink = (req, res) => {
  try {
    const bookingLinks = readFile(BOOKING_LINK_FILE);

    const existingLink = bookingLinks.find(
      (link) => link.userId === req.user.id,
    );

    if (existingLink) {
      return res.json(existingLink);
    }

    const newLink = {
      id: uuidv4(),
      userId: req.user.id,
      slug: uuidv4().replace(/-/g, "").slice(0, 8),
    };

    bookingLinks.push(newLink);

    writeFile(BOOKING_LINK_FILE, bookingLinks);

    res.json(newLink);
  } catch (error) {
    console.error("generateBookingLink error:", error.message || error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

const getBookingLink = (req, res) => {
  const { slug } = req.params;
  const bookingLinks = readFile(BOOKING_LINK_FILE);
  const link = bookingLinks.find((item) => item.slug === slug);

  if (!link) {
    return res.status(404).json({
      message: "Booking link not found",
    });
  }

  res.json(link);
};

module.exports = {
  generateBookingLink,
  getBookingLink,
};
