import { apiRequest } from "./config"

export interface SignupData {
  name: string
  email: string
  password: string
  phone: string
  address: string
  confirmPassword: string // Optional for signup forms, not stored in DB
  city: string // Optional for signup forms, not stored in DB
  country: string // Optional for signup forms, not stored in DB
}

export interface LoginData {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  data: {
    _id: string
    name: string
    email: string
    phone: string
    role: string
    address: string
    city: string
    country: string
    token: string
  }
}

// Register a new user
export const signup = async (userData: SignupData): Promise<AuthResponse> => {
  return await apiRequest("/auth/signup", "POST", userData)
}

// Login user
export const login = async (credentials: LoginData): Promise<AuthResponse> => {
  return await apiRequest("/auth/login", "POST", credentials)
}

// Get current user profile
export const getCurrentUser = async (): Promise<any> => {
  return await apiRequest("/auth/me", "GET", null, true)
}
