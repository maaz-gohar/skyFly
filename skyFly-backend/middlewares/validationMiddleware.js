const { body, validationResult } = require("express-validator");

// Global validation result handler
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error("❌ Validation errors:", errors.array());
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array(),
    });
  }
  next();
};

// User registration validation
const validateSignup = [
  body("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("phone")
    .optional()
    .isMobilePhone().withMessage("Please provide a valid phone number"),
  validate,
];

// User login validation
const validateLogin = [
  body("email")
    .isEmail().withMessage("Please provide a valid email")
    .normalizeEmail(),
  body("password")
    .notEmpty().withMessage("Password is required"),
  validate,
];

// Booking validation
const validateBooking = [
  body("flightId")
    .isMongoId().withMessage("Valid flight ID is required"),
  body("passengers")
    .isArray({ min: 1 }).withMessage("At least one passenger is required")
    .custom((passengers) => {
      for (const passenger of passengers) {
        if (!passenger.name || typeof passenger.name !== "string" || passenger.name.trim().length === 0) {
          throw new Error("Passenger name is required");
        }
        if (
          passenger.age === undefined ||
          typeof passenger.age !== "number" ||
          passenger.age < 0 ||
          passenger.age > 120
        ) {
          throw new Error("Valid passenger age is required (0–120)");
        }
        if (!passenger.gender || !["Male", "Female", "Other"].includes(passenger.gender)) {
          throw new Error("Valid passenger gender is required (Male, Female, Other)");
        }
      }
      return true;
    }),
  body("contactEmail")
    .isEmail().withMessage("Valid contact email is required")
    .normalizeEmail(),
  body("contactPhone")
    .notEmpty().withMessage("Contact phone is required"),
  validate,
];

// Flight creation/update validation
const validateFlight = [
  body("flightNumber")
    .trim().notEmpty().withMessage("Flight number is required"),
  body("airline")
    .trim().notEmpty().withMessage("Airline is required"),
  body("origin")
    .trim().notEmpty().withMessage("Origin is required"),
  body("destination")
    .trim().notEmpty().withMessage("Destination is required"),
  body("departureTime")
    .isISO8601().withMessage("Valid departure time is required"),
  body("arrivalTime")
    .isISO8601().withMessage("Valid arrival time is required"),
  body("price")
    .isFloat({ min: 0 }).withMessage("Valid price is required"),
  body("availableSeats")
    .isInt({ min: 0 }).withMessage("Valid available seats count is required"),
  body("class")
    .optional()
    .isIn(["Economy", "Business", "First"]).withMessage("Valid class is required"),
  validate,
];

// Booking status update
const validateBookingStatus = [
  body("status")
    .isIn(["Pending", "Confirmed", "Cancelled", "Completed"])
    .withMessage("Valid status is required"),
  validate,
];

// Payment status update
const validatePaymentStatus = [
  body("paymentStatus")
    .isIn(["Pending", "Completed", "Failed", "Refunded"])
    .withMessage("Valid payment status is required"),
  validate,
];

const validatePayment = [
  body("bookingId")
    .isMongoId().withMessage("Booking ID must be valid"),

  body("amount")
    .isFloat({ min: 0 }).withMessage("Amount must be a positive number"),

  body("paymentMethod")
    .isIn(["Credit Card", "UPI", "Debit Card", "PayPal", "Bank Transfer"])
    .withMessage("Invalid payment method"),

  // Conditional validations
  body().custom((value) => {
    const { paymentMethod } = value;

    if (paymentMethod === "Credit Card") {
      if (!value.cardHolderName || !value.cardHolderNumber || !value.expiryDate || !value.cvv) {
        throw new Error("Credit Card payment requires cardHolderName, cardHolderNumber, expiryDate, and cvv");
      }
    }

    if (paymentMethod === "UPI") {
      if (!value.upiEmail) {
        throw new Error("UPI payment requires upiEmail");
      }
    }

    return true;
  }),

  validate,
];

module.exports = {
  validate,
  validateSignup,
  validateLogin,
  validateBooking,
  validateFlight,
  validateBookingStatus,
  validatePaymentStatus,
  validatePayment
};
