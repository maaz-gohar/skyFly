import { PaymentMethod } from "@/types"
import { apiRequest } from "./config"

// Process payment
export const processPayment = async (paymentData: PaymentMethod) => {
  return await apiRequest("/payments", "POST", paymentData, true)
}

// Get payment by ID
export const getPaymentById = async (id: string) => {
  return await apiRequest(`/payments/${id}`, "GET", null, true)
}

// Get payments by booking ID
export const getBookingPayments = async (bookingId: string) => {
  return await apiRequest(`/bookings/${bookingId}/payments`, "GET", null, true)
}
