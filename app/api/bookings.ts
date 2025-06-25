import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Booking } from "../types"
import { apiRequest } from "./config"

// Get user bookings
export const getUserBookings = async (userId:string): Promise<Booking[]> => {
  const storedId = await AsyncStorage.getItem("userId")
  const token = await AsyncStorage.getItem("token")
  console.log("🔑 Stored user token:", token ? "User found" : "No user")
  try {
    console.log("🔍 Fetching user bookings...")
    const response = await apiRequest(`/users/${storedId}/bookings`, "GET", null, true)

    console.log("📦 Raw bookings response:", response)

    if (!response.data) {
      console.log("ℹ️ No bookings data received")
      return []
    }

    // Handle both array and object responses
    const bookingsData = Array.isArray(response.data) ? response.data : [response.data]

    console.log("📋 Processing bookings data:", bookingsData)

    // Transform backend data to frontend format
    const transformedBookings = bookingsData.map((booking: any) => {
      console.log("🔄 Transforming booking:", booking)

      return {
        id: booking._id || booking.id,
        _id: booking._id || booking.id,
        userId: booking.userId,
        flight: {
          id: booking.flightId?._id || booking.flightId || booking.flight?.id,
          _id: booking.flightId?._id || booking.flightId || booking.flight?.id,
          flightNumber: booking.flightId?.flightNumber || booking.flight?.flightNumber || "N/A",
          airline: booking.flightId?.airline || booking.flight?.airline || "Unknown Airline",
          logo:
            booking.flightId?.logo ||
            booking.flight?.logo ||
            `https://via.placeholder.com/40x40?text=${(booking.flightId?.airline || booking.flight?.airline || "A").charAt(0)}`,
          origin: booking.flightId?.origin || booking.flight?.origin || "Unknown",
          destination: booking.flightId?.destination || booking.flight?.destination || "Unknown",
          departureTime: booking.flightId?.departureTime || booking.flight?.departureTime || new Date().toISOString(),
          arrivalTime: booking.flightId?.arrivalTime || booking.flight?.arrivalTime || new Date().toISOString(),
          duration: booking.flightId?.duration || booking.flight?.duration || 120,
          stops: booking.flightId?.stops || booking.flight?.stops || 0,
          price: booking.flightId?.price || booking.flight?.price || booking.totalAmount || 0,
          availableSeats: booking.flightId?.availableSeats || booking.flight?.availableSeats || 0,
          totalSeats: booking.flightId?.totalSeats || booking.flight?.totalSeats || 180,
          class: booking.flightId?.class || booking.flight?.class || "Economy",
        },
        passengers: booking.passengers || [],
        totalAmount: booking.totalAmount || 0,
        status: booking.status || "Pending",
        bookingDate: booking.bookingDate || booking.createdAt || new Date().toISOString(),
        contactEmail: booking.contactEmail || "",
        contactPhone: booking.contactPhone || "",
        createdAt: booking.createdAt || new Date().toISOString(),
        updatedAt: booking.updatedAt || new Date().toISOString(),
      }
    })

    console.log("✅ Transformed bookings:", transformedBookings)
    return transformedBookings
  } catch (error) {
    console.error("❌ Get user bookings error:", error)
    throw error
  }
}

// Create new booking
export const createBooking = async (bookingData: {
  flightId: string
  passengers: {
    name: string
    age: number
    gender: "Male" | "Female" | "Other"
  }[]
  contactEmail: string
  contactPhone: string
}) => {
  console.log("📝 Creating booking with data:", bookingData)
  return await apiRequest("/bookings", "POST", bookingData, true)
}

// Get booking by ID
export const getBookingById = async (id: string) => {
  console.log("🔍 Fetching booking by ID:", id)
  return await apiRequest(`/bookings/${id}`, "GET", null, true)
}

// Cancel booking
export const cancelBooking = async (id: string) => {
  console.log("❌ Cancelling booking:", id)
  return await apiRequest(`/bookings/${id}/cancel`, "PUT", null, true)
}

// Update booking
export const updateBooking = async (id: string, bookingData: any) => {
  console.log("📝 Updating booking:", id, bookingData)
  return await apiRequest(`/bookings/${id}`, "PUT", bookingData, true)
}
