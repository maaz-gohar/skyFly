const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const morgan = require("morgan")
const connectDB = require("./config/db")
const { errorHandler } = require("./middlewares/errorMiddleware")
const path = require("path");



// Load environment variables
dotenv.config()

// Connect to database
connectDB()

// Initialize Express
const app = express()

// Middleware
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())

// Logging middleware in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// Routes
app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/flights", require("./routes/flightRoutes"))
app.use("/api/bookings", require("./routes/bookingRoutes"))
app.use("/api/payments", require("./routes/paymentRoutes"))
app.use("/api/users", require("./routes/userRoutes"))
app.use("/api/admin", require("./routes/adminRoutes"))

// Base route
app.get("/", (req, res) => {
  res.send("Flight Booking API is running...")
})

// Error handling middleware
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})
