const mongoose = require("mongoose")

const passengerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add passenger name"],
  },
  age: {
    type: Number,
    required: [true, "Please add passenger age"],
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: [true, "Please add passenger gender"],
  },
  seatNumber: {
    type: String,
  },
})

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
    },
    passengers: [passengerSchema],
    totalAmount: {
      type: Number,
      required: [true, "Please add total amount"],
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
      default: "Pending",
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    contactEmail: {
      type: String,
      required: [true, "Please add contact email"],
    },
    contactPhone: {
      type: String,
      required: [true, "Please add contact phone"],
    },
  },
  {
    timestamps: true,
  },
)

// Create index for searching bookings
bookingSchema.index({ userId: 1, status: 1 })

module.exports = mongoose.model("Booking", bookingSchema)
