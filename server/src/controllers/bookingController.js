const path = require("path");
const { v4: uuidv4 } = require("uuid");

const { readFile, writeFile } = require("../utils/fileHelper");

const AVAILABILITY_FILE = path.join(
  __dirname,
  "../../storage/availability.json",
);
const BOOKING_LINK_FILE = path.join(
  __dirname,
  "../../storage/bookingLinks.json",
);
const BOOKINGS_FILE = path.join(__dirname, "../../storage/bookings.json");

function generateSlots(startTime, endTime) {
  const slots = [];

  let start = new Date(`2000-01-01T${startTime}`);
  const end = new Date(`2000-01-01T${endTime}`);

  while (start < end) {
    const next = new Date(start.getTime() + 30 * 60000);

    slots.push({
      start: start.toTimeString().slice(0, 5),
      end: next.toTimeString().slice(0, 5),
    });

    start = next;
  }

  return slots;
}

const getAvailableSlots = (req, res) => {
  const { slug } = req.params;
  const bookingLinks = readFile(BOOKING_LINK_FILE);
  const link = bookingLinks.find((l) => l.slug === slug);

  if (!link) {
    return res.status(404).json({
      message: "Invalid link",
    });
  }

  const availability = readFile(AVAILABILITY_FILE);
  const bookings = readFile(BOOKINGS_FILE);
  const userAvailability = availability.filter((a) => a.userId === link.userId);
  const result = userAvailability.map((item) => {
    const allSlots = generateSlots(item.startTime, item.endTime);

    const booked = bookings.filter(
      (booking) =>
        booking.bookingLinkId === link.id && booking.date === item.date,
    );

    const availableSlots = allSlots.filter(
      (slot) => !booked.some((b) => b.startTime === slot.start),
    );

    return {
      date: item.date,
      slots: availableSlots,
    };
  });

  res.json(result);
};

const createBooking = (req, res) => {
  const { slug } = req.params;
  const { date, startTime, endTime } = req.body;
  const bookingLinks = readFile(BOOKING_LINK_FILE);
  const bookings = readFile(BOOKINGS_FILE);
  const link = bookingLinks.find((l) => l.slug === slug);

  if (!link) {
    return res.status(404).json({
      message: "Invalid link",
    });
  }

  const exists = bookings.find(
    (booking) =>
      booking.bookingLinkId === link.id &&
      booking.date === date &&
      booking.startTime === startTime,
  );

  if (exists) {
    return res.status(409).json({
      message: "Slot already booked",
    });
  }

  const newBooking = {
    id: uuidv4(),
    bookingLinkId: link.id,
    date,
    startTime,
    endTime,
  };

  bookings.push(newBooking);

  writeFile(BOOKINGS_FILE, bookings);
  res.status(201).json(newBooking);
};

module.exports = {
  getAvailableSlots,
  createBooking,
};
