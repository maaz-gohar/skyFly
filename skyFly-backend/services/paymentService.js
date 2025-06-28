const Payment = require("../models/Payment")
const Booking = require("../models/Booking")

// Process payment
exports.processPayment = async (paymentData) => {
  const {
    bookingId,
    paymentMethod,
    cardHolderName,
    cardHolderNumber,
    expiryDate,
    cvv,
    upiEmail,
  } = paymentData;

  const booking = await Booking.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  const serviceCharge = 45;
  const finalAmount = booking.totalAmount + serviceCharge;

  // Optional: if client sends `amount`, you can validate (if needed)
  // if (paymentData.amount !== finalAmount)
  //   throw new Error("Payment amount does not match expected total");

  // Validate payment method fields
  if (paymentMethod === "Credit Card") {
    if (!cardHolderName || !cardHolderNumber || !expiryDate || !cvv)
      throw new Error("Missing credit card details");
    if (upiEmail)
      throw new Error("UPI Email should not be provided with Credit Card");

  } else if (paymentMethod === "UPI") {
    if (!upiEmail)
      throw new Error("UPI Email is required for UPI payment");
    if (cardHolderName || cardHolderNumber || expiryDate || cvv)
      throw new Error("Card details should not be provided with UPI payment");
  }

  const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

  const payment = await Payment.create({
    bookingId,
    amount: finalAmount, // ✅ includes ₹45
    paymentMethod,
    paymentStatus: "Completed",
    transactionId,
    cardHolderName: paymentMethod === "Credit Card" ? cardHolderName : undefined,
    cardNumberLast4: paymentMethod === "Credit Card" ? cardHolderNumber.slice(-4) : undefined,
    expiryDate: paymentMethod === "Credit Card" ? expiryDate : undefined,
    upiEmail: paymentMethod === "UPI" ? upiEmail : undefined,
  });

  await Booking.findByIdAndUpdate(bookingId, { status: "Confirmed" });

  return payment;
};



// Get payment by ID
exports.getPaymentById = async (id) => {
  return await Payment.findById(id).populate("bookingId")
}

// Get payments by booking ID
exports.getPaymentsByBookingId = async (bookingId) => {
  return await Payment.find({ bookingId })
}

// Refund payment
exports.refundPayment = async (id) => {
  const payment = await Payment.findById(id)
  if (!payment) {
    throw new Error("Payment not found")
  }

  if (payment.paymentStatus === "Refunded") {
    throw new Error("Payment is already refunded")
  }

  // Update payment status
  payment.paymentStatus = "Refunded"
  await payment.save()

  // Update booking status
  await Booking.findByIdAndUpdate(payment.bookingId, { status: "Cancelled" })

  return payment
}
