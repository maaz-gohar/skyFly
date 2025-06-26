const Booking = require("../models/Booking")
const Flight = require("../models/Flight")

// Create new booking
exports.createBooking = async (bookingData) => {
  const { flightId, passengers } = bookingData;

  // Check if flight exists and has enough seats
  const flight = await Flight.findById(flightId);
  if (!flight) {
    throw new Error("Flight not found");
  }

  if (flight.availableSeats < passengers) {
    throw new Error("Not enough seats available");
  }

  // Calculate total amount
  const totalAmount = flight.price * passengers;

  // Create booking
  const booking = await Booking.create({
    ...bookingData,
    totalAmount,
  });

  // Update available seats
  await Flight.findByIdAndUpdate(flightId, {
    $inc: { availableSeats: -passengers },
  });

  return booking;
};


// Get booking by ID
exports.getBookingById = async (id) => {
  return await Booking.findById(id).populate("userId", "name email phone").populate("flightId")
}

// Get user bookings
exports.getUserBookings = async (userId) => {
  return await Booking.find({ userId }).populate("flightId").sort({ bookingDate: -1 })
}

// Update booking status
exports.updateBookingStatus = async (id, status) => {
  return await Booking.findByIdAndUpdate(id, { status }, { new: true, runValidators: true })
}

// Cancel booking
exports.cancelBooking = async (id) => {
  const booking = await Booking.findById(id)
  if (!booking) {
    throw new Error("Booking not found")
  }

  if (booking.status === "Cancelled") {
    throw new Error("Booking is already cancelled")
  }

  // Update booking status
  booking.status = "Cancelled"
  await booking.save()

  // Restore available seats
  await Flight.findByIdAndUpdate(booking.flightId, {
    $inc: { availableSeats: booking.passengers.length },
  })

  return booking
}
