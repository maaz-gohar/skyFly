const mongoose = require("mongoose")

// const passengerSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: [true, "Passenger name is required"],
//     trim: true,
//   },
//   age: {
//     type: Number,
//     required: [true, "Passenger age is required"],
//     min: [0, "Age must be positive"],
//     max: [120, "Age must be realistic"],
//   },
//   gender: {
//     type: String,
//     required: [true, "Passenger gender is required"],
//     enum: ["Male", "Female", "Other"],
//   },
//   seatNumber: {
//     type: String,
//     trim: true,
//   },
// })

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flight",
      required: [true, "Flight ID is required"],
    },
    passengers: {
      type: Number,
      required: [true, "At least one passenger is required"],
      // validate: {
      //   validator: (passengers) => passengers && passengers.length > 0,
      //   message: "At least one passenger is required",
      // },
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount must be positive"],
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
      required: [true, "Contact email is required"],
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      required: [true, "Contact phone is required"],
      trim: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },
    specialRequests: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
)

// Indexes for better query performance
bookingSchema.index({ userId: 1, createdAt: -1 })
bookingSchema.index({ flightId: 1 })
bookingSchema.index({ status: 1 })

module.exports = mongoose.model("Booking", bookingSchema)
