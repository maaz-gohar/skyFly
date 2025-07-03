import type {
  AdminBooking,
  AdminFlight,
  AdminPayment,
  ApiResponse,
  DashboardStats,
  FlightFormData,
  User,
} from "../types"
import { apiRequest } from "./config"

// Dashboard APIs
export const getDashboardStats = async (): Promise<ApiResponse<DashboardStats>> => {
  return await apiRequest("/admin/dashboard/stats", "GET", null, true)
}

// Flight Management APIs
export const getAllFlights = async (page = 1, limit = 10): Promise<ApiResponse<AdminFlight[]>> => {
  return await apiRequest(`/admin/flights?page=${page}&limit=${limit}`, "GET", null, true)
}

export const createFlight = async (flightData: FlightFormData): Promise<ApiResponse<AdminFlight>> => {
  return await apiRequest("/flights", "POST", flightData, true)
}

export const updateFlight = async (
  flightId: string,
  flightData: Partial<FlightFormData>,
): Promise<ApiResponse<AdminFlight>> => {
  return await apiRequest(`/flights/${flightId}`, "PUT", flightData, true)
}

export const deleteFlight = async (flightId: string): Promise<ApiResponse> => {
  return await apiRequest(`/flights/${flightId}`, "DELETE", null, true)
}

export const toggleFlightStatus = async (flightId: string): Promise<ApiResponse<AdminFlight>> => {
  return await apiRequest(`/admin/flights/${flightId}/toggle-status`, "PATCH", null, true)
}

// User Management APIs
export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  return await apiRequest(`/admin/users`, "GET", null, true)
}

export const updateUserStatus = async (userId: string, isActive: boolean): Promise<ApiResponse<User>> => {
  return await apiRequest(`/admin/users/${userId}/status`, "PATCH", { isActive }, true)
}

export const deleteUser = async (userId: string): Promise<ApiResponse> => {
  return await apiRequest(`/admin/users/${userId}`, "DELETE", null, true)
}

export const updateUserRole = async (userId: string, role: "user" | "admin"): Promise<ApiResponse<User>> => {
  return await apiRequest(`/admin/users/${userId}/role`, "PATCH", { role }, true)
}

// Booking Management APIs
export const getAllBookings = async (): Promise<ApiResponse<{ bookings: AdminBooking[] }>> => {
  return await apiRequest(`/admin/bookings`, "GET", null, true)
}

export const updateBookingStatus = async (
  bookingId: string,
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed",
): Promise<ApiResponse<AdminBooking>> => {
  return await apiRequest(`/admin/bookings/${bookingId}/status`, "PATCH", { status }, true)
}

export const getBookingDetails = async (bookingId: string): Promise<ApiResponse<AdminBooking>> => {
  return await apiRequest(`/admin/bookings/${bookingId}`, "GET", null, true)
}

// Payment Management APIs
export const getAllPayments = async (page = 1, limit = 10): Promise<ApiResponse<AdminPayment[]>> => {
  return await apiRequest(`/admin/payments?page=${page}&limit=${limit}`, "GET", null, true)
}

export const processRefund = async (paymentId: string, amount?: number): Promise<ApiResponse<AdminPayment>> => {
  return await apiRequest(`/admin/payments/${paymentId}/refund`, "POST", { amount }, true)
}

export const updatePaymentStatus = async (
  paymentId: string,
  status: "Pending" | "Completed" | "Failed" | "Refunded",
): Promise<ApiResponse<AdminPayment>> => {
  return await apiRequest(`/admin/payments/${paymentId}/status`, "PATCH", { status }, true)
}

// Analytics APIs
export const getRevenueAnalytics = async (period: "week" | "month" | "year" = "month"): Promise<ApiResponse> => {
  return await apiRequest(`/admin/analytics/revenue?period=${period}`, "GET", null, true)
}

export const getBookingAnalytics = async (period: "week" | "month" | "year" = "month"): Promise<ApiResponse> => {
  return await apiRequest(`/admin/analytics/bookings?period=${period}`, "GET", null, true)
}

export const getUserAnalytics = async (): Promise<ApiResponse> => {
  return await apiRequest("/admin/analytics/users", "GET", null, true)
}
