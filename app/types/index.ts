import type { RouteProp } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import type { RootStackParamList } from "../app/_layout"

// Navigation Types
export type ScreenNavigationProp<T extends keyof RootStackParamList> = StackNavigationProp<RootStackParamList, T>
export type ScreenRouteProp<T extends keyof RootStackParamList> = RouteProp<RootStackParamList, T>

export interface ScreenProps<T extends keyof RootStackParamList> {
  navigation: ScreenNavigationProp<T>
  route: ScreenRouteProp<T>
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

// User Types
export interface User {
  _id: string
  name: string
  email: string
  phone: string
  role: "user" | "admin"
  address: string
  city: string
  country: string
  isActive?: boolean
  createdAt: string
  updatedAt: string
  status: "active" | "inactive" | "banned"
  avatar: string // URL to user's avatar image
}

export interface UserProfile extends User {
  dateOfBirth?: string
  gender?: string
  nationality?: string
  passportNumber?: string
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
}

// Flight Types - Updated to match frontend usage
export interface Flight {
  id: string
  _id?: string
  flightNumber: string
  airline: string
  logo?: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  duration: number // in minutes
  stops: number
  price: number
  availableSeats: number
  totalSeats?: number
  class: "Economy" | "Business" | "First"
  isActive?: boolean
  status: "Scheduled"| "Delayed"| "Cancelled"| "Completed"
  amenities?: string[]
  baggage?: {
    carry: string
    checked: string
  }
}

export interface AdminFlight {
  _id: string
  flightNumber: string
  airline: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  price: number
  availableSeats: number
  totalSeats?: number
  class: "Economy" | "Business" | "First"
  status?: "Scheduled"| "Delayed"| "Cancelled"| "Completed"
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface FlightSearchParams {
  origin?: string
  destination?: string
  departureDate?: string
  returnDate?: string
  passengers?: number
  class?: "Economy" | "Business" | "First"
  from?: string
  to?: string
}

// Booking Types - Updated to match frontend usage
export interface Booking {
  id: string
  _id?: string
  userId: string
  flight: Flight
  passengers:number
  totalAmount: number
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed"
  bookingDate: string
  contactEmail: string
  contactPhone: string
  createdAt: string
  updatedAt: string
}

export interface AdminBooking {
  _id: string
  userId: {
    _id: string
    name: string
    email: string
  }
  flightId: {
    _id: string
    flightNumber: string
    airline: string
    origin: string
    destination: string
  }
  passengers:number
  totalAmount: number
  status: "Pending" | "Confirmed" | "Cancelled" | "Completed"
  bookingDate: string
  contactEmail: string
  contactPhone: string
  createdAt: string
  updatedAt: string
}

export interface PassengerDetails {
  firstName: string
  lastName: string
  dob: string
  gender: string
  nationality: string
  email: string
  phone: string
}

// Payment Types
export interface AdminPayment {
  _id: string
  bookingId: {
    _id: string
    flightId: {
      flightNumber: string
      airline: string
    }
    userId: {
      name: string
      email: string
    }
  }
  amount: number
  paymentMethod: "Credit Card" | "Debit Card" | "PayPal" | "Bank Transfer"
  paymentStatus: "Pending" | "Completed" | "Failed" | "Refunded"
  paymentDate: string
  transactionId?: string
  createdAt: string
  updatedAt: string
}

// Dashboard Types
export interface DashboardStats {
  totalFlights: number
  totalBookings: number
  totalUsers: number
  totalRevenue: number
  recentBookings: number | object[]
  activeFlights: number
  activeUsers: number
  monthlyRevenue: {
    month: string
    revenue: number
  }[]
  bookingsByStatus: {
    status: string
    count: number
  }[]
  topDestinations: {
    destination: string
    count: number
  }[]
}

// Form Types
export interface FlightFormData {
  flightNumber: string
  airline: string
  origin: string
  destination: string
  departureTime: string
  arrivalTime: string
  price: number
  availableSeats: number
  class: "Economy" | "Business" | "First"
}

export interface LoginFormData {
  email: string
  password: string
}

export interface SignUpFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
}

// Travel Preferences Types
export interface TravelPreferences {
  preferredClass: "Economy" | "Business" | "First"
  seatPreference: "Window" | "Aisle" | "Middle"
  mealPreference: "Vegetarian" | "Non-Vegetarian" | "Vegan" | "Halal"
  specialAssistance: string[]
  frequentDestinations: string[]
}

// Payment Method Types
export interface PaymentMethod {
  id: string
  type: "Credit Card" | "Debit Card" | "PayPal" | "UPI"
  last4?: string                     // last 4 digits of card
  cardNumber?: string               // optional for submission, not for display
  expiryDate?: string
  cardholderName?: string
  cvv?: string                      // optional (only for form, not for storage/display)
  upiEmail?: string                // for UPI payments only
  isDefault: boolean
}


// Frequent Flyer Types
export interface FrequentFlyerProgram {
  id: string
  airline: string
  membershipNumber: string
  tier: "Bronze" | "Silver" | "Gold" | "Platinum"
  points: number
}
