const mongoose = require("mongoose")

// Helper to parse custom date string
const parseDate = (val) => {
  if (typeof val === "string") {
    const [datePart, timePart] = val.trim().split(" ")

    const [day, month, year] = datePart.split("-").map(Number)
    const [hours = 0, minutes = 0] = (timePart || "00:00").split(":").map(Number)

    return new Date(year, month - 1, day, hours, minutes)
  }
  return val // already a Date object
}

const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: [true, "Please add a flight number"],
      unique: true,
      trim: true,
    },
    airline: {
      type: String,
      required: [true, "Please add an airline name"],
    },
    origin: {
      type: String,
      required: [true, "Please add an origin"],
    },
    destination: {
      type: String,
      required: [true, "Please add a destination"],
    },
    departureTime: {
      type: Date,
      required: [true, "Please add a departure time"],
      set: parseDate,
    },
    arrivalTime: {
      type: Date,
      required: [true, "Please add an arrival time"],
      set: parseDate,
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
      min: [0, "Price cannot be negative"],
    },
    availableSeats: {
      type: Number,
      required: [true, "Please add available seats"],
      min: [0, "Available seats cannot be negative"],
    },
    class: {
      type: String,
      enum: ["Economy", "Business", "First"],
      default: "Economy",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

// Index for search optimization
flightSchema.index({ origin: 1, destination: 1, departureTime: 1 })

module.exports = mongoose.model("Flight", flightSchema)
